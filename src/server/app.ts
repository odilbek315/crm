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
import { authRouter } from './routes/auth.js';
import { customersRouter } from './routes/customers.js';
import { leadsRouter } from './routes/leads.js';
import { dealsRouter } from './routes/deals.js';
import { tasksRouter } from './routes/tasks.js';
import { documentsRouter } from './routes/documents.js';
import { employeesRouter } from './routes/employees.js';
import { adminRouter } from './routes/admin.js';
import { auditRouter } from './routes/audit.js';
import { authenticateToken } from './middleware/auth.js';
import { GoogleGenAI } from '@google/genai';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'request.headers.authorization',
    'request.headers.cookie',
  ],
});

const copilotChatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string().max(4000),
  })).max(20).optional().default([]),
});

export const app = express();

// Logging & Tracing
app.use(pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID()
}));

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production'
    ? {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:'],
          frameAncestors: ["'none'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          upgradeInsecureRequests: [],
        },
      }
    : false // Disabled only for Vite dev server compatibility
}));

// CORS Hardening
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Body parser with limit
app.use(hpp()); // HTTP Parameter Pollution protection

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts, please try again later',
});
app.use(['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'], authLimiter);

// API Routes
app.get("/api/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));
app.use("/api/auth", authRouter);
app.use("/api/customers", customersRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/audit", auditRouter);

// AI Co-Pilot chat route
app.post("/api/copilot/chat", authenticateToken as any, async (req, res) => {
  try {
    const { message, history } = copilotChatSchema.parse(req.body);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        response: "Salom! Men sizning Executive Co-Pilot AI yordamchingizman. Hozirda Gemini API kaliti (GEMINI_API_KEY) .env faylida sozlanmagan, shuning uchun men simulyatsiya rejimida ishlayapman. Tizim sozlamalari, mijozlar va leadlarni optimallashtirish bo'yicha qanday savolingiz bor?"
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
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    logger.error({ err }, 'Copilot request failed');
    res.json({
      response: "Kechirasiz, so'rovingizni qayta ishlashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
    });
  }
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err, method: req.method, path: req.path }, 'Unhandled Exception');
  res.status(500).json({ error: 'Internal Server Error' });
});
