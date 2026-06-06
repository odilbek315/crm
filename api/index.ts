// This file is the Vercel Serverless Function entry point.
// It re-exports the Express app.
// Vercel's @vercel/node runtime will pick this up automatically.

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import pinoHttp from 'pino-http';
import pino from 'pino';
import crypto from 'crypto';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

// ─── Prisma Client ───
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ─── Logger ───
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'request.headers.authorization',
    'request.headers.cookie',
  ],
});

// ─── Auth Helpers ───
const isProduction = process.env.NODE_ENV === 'production';
const generatedDevJwtSecret = crypto.randomBytes(32).toString('hex');
const generatedDevRefreshSecret = crypto.randomBytes(32).toString('hex');

function getSecret(name: 'JWT_SECRET' | 'REFRESH_SECRET', developmentSecret: string) {
  const value = process.env[name];
  const isPlaceholder = !value || value.startsWith('YOUR_') || value.startsWith('MY_') || value.length < 32;
  if (isPlaceholder && isProduction) {
    throw new Error(`${name} must be configured with at least 32 characters in production`);
  }
  if (isPlaceholder) {
    console.warn(`${name} is not configured securely; using an ephemeral development-only secret`);
    return developmentSecret;
  }
  return value;
}

const JWT_SECRET = getSecret('JWT_SECRET', generatedDevJwtSecret);
const REFRESH_SECRET = getSecret('REFRESH_SECRET', generatedDevRefreshSecret);

interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: string;
    organizationId: string;
    role: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const [scheme, token] = typeof authHeader === 'string' ? authHeader.split(' ') : [];
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256'],
    audience: 'market-erp-api',
    issuer: 'market-erp',
  }, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user as any;
    next();
  });
};

const generateToken = (userId: string, organizationId: string, role: string) => {
  return jwt.sign({ sub: userId, userId, organizationId, role }, JWT_SECRET, {
    algorithm: 'HS256',
    audience: 'market-erp-api',
    issuer: 'market-erp',
    expiresIn: '15m',
  });
};

const generateRefreshToken = () => crypto.randomBytes(48).toString('base64url');
const hashRefreshToken = (refreshToken: string) => crypto.createHmac('sha256', REFRESH_SECRET).update(refreshToken).digest('hex');
const hashOneTimeToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// ─── Zod Schemas ───
const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).transform(email => email.toLowerCase()),
  password: z.string().min(8).max(128),
  organizationName: z.string().trim().min(2).max(120),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(255).transform(email => email.toLowerCase()),
  password: z.string().min(1).max(128),
});
const refreshSchema = z.object({
  refreshToken: z.string().min(32).max(256),
});
const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255).transform(email => email.toLowerCase()),
});
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

const copilotChatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string().max(4000),
  })).max(20).optional().default([]),
});

// ─── Helpers ───
const authUserSelect = {
  id: true, name: true, email: true, role: true,
  organizationId: true,
  organization: { select: { name: true } },
  passwordHash: true, deletedAt: true,
};
const publicUser = (
  user: { id: string; name: string; email: string; role: string; organizationId: string },
  organizationName?: string,
) => ({
  id: user.id, name: user.name, email: user.email,
  role: user.role, organizationId: user.organizationId,
  organizationName,
});

// Helper: require at least one of the specified roles
const requireRole = (...roles: string[]) => (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// ─── Express App ───
const app = express();

app.use(pinoHttp({ logger, genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID() }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(hpp());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
app.use('/api', limiter);
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many auth attempts' });
app.use(['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'], authLimiter);

// ─── Health ───
app.get("/api/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// ─── AUTH ROUTES ───
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, organizationName } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        users: {
          create: { email, name, passwordHash: hashedPassword, role: 'Administrator' }
        }
      },
      include: { users: true }
    });
    const user = organization.users[0];
    const token = generateToken(user.id, organization.id, user.role);
    const rawRefresh = generateRefreshToken();
    const hashedRefresh = hashRefreshToken(rawRefresh);
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashedRefresh,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000),
      },
    });
    res.status(201).json({
      token, refreshToken: rawRefresh,
      user: publicUser(user, organization.name),
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    logger.error({ err }, 'Registration failed');
    res.status(500).json({ error: 'Registration failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email }, select: authUserSelect });
    if (!user || user.deletedAt) return res.status(401).json({ error: 'Invalid credentials' });
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.organizationId, user.role);
    const rawRefresh = generateRefreshToken();
    const hashedRefresh = hashRefreshToken(rawRefresh);
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashedRefresh,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000),
      },
    });
    res.json({
      token, refreshToken: rawRefresh,
      user: publicUser(user, user.organization?.name),
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    logger.error({ err }, 'Login failed');
    res.status(500).json({ error: 'Login failed' });
  }
});

authRouter.post('/refresh', async (req, res) => {
  try {
    const { refreshToken: rawToken } = refreshSchema.parse(req.body);
    const hashed = hashRefreshToken(rawToken);
    const session = await prisma.session.findUnique({ where: { refreshToken: hashed }, include: { user: { select: authUserSelect } } });
    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.session.delete({ where: { id: session.id } });
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    const user = session.user;
    if (user.deletedAt) return res.status(401).json({ error: 'Account has been deleted' });
    await prisma.session.delete({ where: { id: session.id } });
    const newToken = generateToken(user.id, user.organizationId, user.role);
    const newRawRefresh = generateRefreshToken();
    const newHashedRefresh = hashRefreshToken(newRawRefresh);
    await prisma.session.create({
      data: { userId: user.id, refreshToken: newHashedRefresh, expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000) },
    });
    res.json({ token: newToken, refreshToken: newRawRefresh, user: publicUser(user, user.organization?.name) });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    logger.error({ err }, 'Token refresh failed');
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

authRouter.post('/logout', authenticateToken as any, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.userId;
    await prisma.session.deleteMany({ where: { userId } });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    logger.error({ err }, 'Logout failed');
    res.status(500).json({ error: 'Logout failed' });
  }
});

authRouter.get('/me', authenticateToken as any, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, organizationId: true, organization: { select: { name: true } } },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: publicUser(user, user.organization?.name) });
  } catch (err) {
    logger.error({ err }, 'Get user failed');
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.use("/api/auth", authRouter);

// ─── CUSTOMERS ROUTES ───
const customersRouter = express.Router();
customersRouter.use(authenticateToken as any);

customersRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.organizationId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId, deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.customer.count({ where }),
    ]);
    res.json({ customers, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error({ err }, 'Failed to list customers');
    res.status(500).json({ error: 'Failed to list customers' });
  }
});

customersRouter.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    logger.error({ err }, 'Failed to get customer');
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

customersRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const schema = z.object({
      name: z.string().trim().min(1).max(200),
      email: z.string().trim().email().max(255),
      phone: z.string().max(50).optional(),
      company: z.string().max(200).optional(),
      status: z.string().max(50).optional(),
      value: z.number().min(0).optional(),
    });
    const data = schema.parse(req.body);
    const customer = await prisma.customer.create({
      data: { ...data, organizationId: req.user!.organizationId },
    });
    res.status(201).json(customer);
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    if (err?.code === 'P2002') return res.status(409).json({ error: 'Customer with this email already exists' });
    logger.error({ err }, 'Failed to create customer');
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

customersRouter.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const schema = z.object({
      name: z.string().trim().min(1).max(200).optional(),
      email: z.string().trim().email().max(255).optional(),
      phone: z.string().max(50).optional().nullable(),
      company: z.string().max(200).optional().nullable(),
      status: z.string().max(50).optional(),
      value: z.number().min(0).optional(),
    });
    const data = schema.parse(req.body);
    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Customer not found' });
    const customer = await prisma.customer.update({ where: { id: req.params.id }, data });
    res.json(customer);
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    if (err?.code === 'P2002') return res.status(409).json({ error: 'Customer with this email already exists' });
    logger.error({ err }, 'Failed to update customer');
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

customersRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
    });
    if (!existing) return res.status(404).json({ error: 'Customer not found' });
    await prisma.customer.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    logger.error({ err }, 'Failed to delete customer');
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

app.use("/api/customers", customersRouter);

// ─── GENERIC CRUD HELPER ───
function createCrudRouter(modelName: string, modelAccessor: any, createSchema: z.ZodType<any>, updateSchema: z.ZodType<any>) {
  const router = express.Router();
  router.use(authenticateToken as any);

  router.get('/', async (req: AuthenticatedRequest, res) => {
    try {
      const orgId = req.user!.organizationId;
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
      const skip = (page - 1) * limit;
      const where: any = { organizationId: orgId, deletedAt: null };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }
      // Add status/stage filter
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
      if (status) where.status = status;
      const stage = typeof req.query.stage === 'string' ? req.query.stage.trim() : '';
      if (stage) where.stage = stage;

      const [items, total] = await Promise.all([
        modelAccessor.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        modelAccessor.count({ where }),
      ]);
      res.json({ [modelName]: items, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (err) {
      logger.error({ err }, `Failed to list ${modelName}`);
      res.status(500).json({ error: `Failed to list ${modelName}` });
    }
  });

  router.get('/:id', async (req: AuthenticatedRequest, res) => {
    try {
      const item = await modelAccessor.findFirst({
        where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
      });
      if (!item) return res.status(404).json({ error: `${modelName} not found` });
      res.json(item);
    } catch (err) {
      logger.error({ err }, `Failed to get ${modelName}`);
      res.status(500).json({ error: `Failed to get ${modelName}` });
    }
  });

  router.post('/', async (req: AuthenticatedRequest, res) => {
    try {
      const data = createSchema.parse(req.body);
      const item = await modelAccessor.create({
        data: { ...data, organizationId: req.user!.organizationId },
      });
      res.status(201).json(item);
    } catch (err: any) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
      logger.error({ err }, `Failed to create ${modelName}`);
      res.status(500).json({ error: `Failed to create ${modelName}` });
    }
  });

  router.put('/:id', async (req: AuthenticatedRequest, res) => {
    try {
      const data = updateSchema.parse(req.body);
      const existing = await modelAccessor.findFirst({
        where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
      });
      if (!existing) return res.status(404).json({ error: `${modelName} not found` });
      const item = await modelAccessor.update({ where: { id: req.params.id }, data });
      res.json(item);
    } catch (err: any) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
      logger.error({ err }, `Failed to update ${modelName}`);
      res.status(500).json({ error: `Failed to update ${modelName}` });
    }
  });

  router.delete('/:id', async (req: AuthenticatedRequest, res) => {
    try {
      const existing = await modelAccessor.findFirst({
        where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
      });
      if (!existing) return res.status(404).json({ error: `${modelName} not found` });
      await modelAccessor.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
      res.json({ message: `${modelName} deleted successfully` });
    } catch (err) {
      logger.error({ err }, `Failed to delete ${modelName}`);
      res.status(500).json({ error: `Failed to delete ${modelName}` });
    }
  });

  return router;
}

// ─── LEADS ───
const leadsCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  company: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  status: z.string().max(50).optional(),
  score: z.number().int().min(0).max(100).optional(),
});
const leadsUpdateSchema = leadsCreateSchema.partial();
app.use("/api/leads", createCrudRouter('leads', prisma.lead, leadsCreateSchema, leadsUpdateSchema));

// ─── DEALS ───
const dealsCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  value: z.number().min(0).optional(),
  stage: z.string().max(50).optional(),
  expectedClose: z.string().optional(),
  customerId: z.string().uuid().optional().nullable(),
});
const dealsUpdateSchema = dealsCreateSchema.partial();
app.use("/api/deals", createCrudRouter('deals', prisma.deal, dealsCreateSchema, dealsUpdateSchema));

// ─── TASKS ───
const tasksCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.string().max(50).optional(),
  priority: z.string().max(50).optional(),
  dueDate: z.string().optional(),
});
const tasksUpdateSchema = tasksCreateSchema.partial();
app.use("/api/tasks", createCrudRouter('tasks', prisma.task, tasksCreateSchema, tasksUpdateSchema));

// ─── DOCUMENTS ───
const docsCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  type: z.string().max(50).optional(),
  size: z.number().int().min(0).optional(),
  url: z.string().max(2000).optional(),
  status: z.string().max(50).optional(),
});
const docsUpdateSchema = docsCreateSchema.partial();
app.use("/api/documents", createCrudRouter('documents', prisma.document, docsCreateSchema, docsUpdateSchema));

// ─── EMPLOYEES ───
const employeesCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  department: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  status: z.string().max(50).optional(),
});
const employeesUpdateSchema = employeesCreateSchema.partial();
app.use("/api/employees", createCrudRouter('employees', prisma.employee, employeesCreateSchema, employeesUpdateSchema));

// ─── AUDIT ───
const auditRouter = express.Router();
auditRouter.use(authenticateToken as any);
auditRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.organizationId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ where: { organizationId: orgId }, skip, take: limit, orderBy: { timestamp: 'desc' } }),
      prisma.auditLog.count({ where: { organizationId: orgId } }),
    ]);
    res.json({ logs, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error({ err }, 'Failed to list audit logs');
    res.status(500).json({ error: 'Failed to list audit logs' });
  }
});
app.use("/api/audit", auditRouter);

// ─── ADMIN ───
const adminRouter = express.Router();
adminRouter.use(authenticateToken as any);
adminRouter.use(requireRole('Administrator') as any);

adminRouter.get('/users', async (req: AuthenticatedRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: req.user!.organizationId, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (err) {
    logger.error({ err }, 'Failed to list users');
    res.status(500).json({ error: 'Failed to list users' });
  }
});

adminRouter.put('/users/:id/role', async (req: AuthenticatedRequest, res) => {
  try {
    const roleSchema = z.object({ role: z.enum(['Administrator', 'Manager', 'User']) });
    const { role } = roleSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
    res.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    logger.error({ err }, 'Failed to update user role');
    res.status(500).json({ error: 'Failed to update role' });
  }
});

adminRouter.delete('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (req.params.id === req.user!.userId) return res.status(400).json({ error: 'Cannot delete yourself' });
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await prisma.user.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    logger.error({ err }, 'Failed to delete user');
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.use("/api/admin", adminRouter);

// ─── COPILOT ───
app.post("/api/copilot/chat", authenticateToken as any, async (req, res) => {
  try {
    const { message, history } = copilotChatSchema.parse(req.body);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        response: "Salom! Men sizning Executive Co-Pilot AI yordamchingizman. Hozirda Gemini API kaliti .env faylida sozlanmagan."
      });
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        "You are an Executive Co-Pilot AI helper for Market ERP system. You help executive managers make strategic decisions. Keep answers extremely brief, clear, and professional. Respond in the same language the user writes (Uzbek or English).",
        ...history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`),
        `User: ${message}`
      ].join('\n')
    });
    res.json({ response: response.text });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.issues });
    logger.error({ err }, 'Copilot request failed');
    res.json({ response: "Kechirasiz, xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring." });
  }
});

// ─── Global Error Handler ───
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err, method: req.method, path: req.path }, 'Unhandled Exception');
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
