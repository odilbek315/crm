import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const router = Router();

// Apply auth middleware to all customer routes
router.use(authenticateToken as any);

const customerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email().max(255).transform(e => e.toLowerCase()),
  phone: z.string().trim().max(50).optional().nullable(),
  company: z.string().trim().max(100).optional().nullable(),
  status: z.string().trim().max(20).optional(),
  value: z.number().min(0).optional()
});

const logAudit = async (req: AuthenticatedRequest, action: string, entityId: string, changes?: any) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action,
        entityType: 'CUSTOMER',
        entityId,
        changes: changes ? JSON.stringify(changes) : null,
        organizationId: req.user!.organizationId,
      }
    });
  } catch (err) {
    if (req.log) req.log.error({ err, entityId }, 'Failed to write audit log');
  }
};

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const status = req.query.status as string;

    const where: any = {
      organizationId: req.user!.organizationId,
      deletedAt: null
    };

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      data: customers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { 
        id: req.params.id,
        organizationId: req.user!.organizationId,
        deletedAt: null
      }
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = customerSchema.parse(req.body);
    const customer = await prisma.customer.create({
      data: {
        ...data,
        organizationId: req.user!.organizationId
      }
    });
    
    if (req.log) req.log.info({ customerId: customer.id }, 'Customer created');
    await logAudit(req, 'CREATE', customer.id, data);
    
    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'A customer with this email already exists' });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = customerSchema.partial().parse(req.body);
    
    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    
    if (!existing) return res.status(404).json({ error: 'Customer not found' });

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data
    });

    if (req.log) req.log.info({ customerId: customer.id }, 'Customer updated');
    await logAudit(req, 'UPDATE', customer.id, data);

    res.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'A customer with this email already exists' });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Role Check
    if (req.user!.role === 'USER') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions to delete customer' });
    }

    const existing = await prisma.customer.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    
    if (!existing) return res.status(404).json({ error: 'Customer not found' });

    await prisma.customer.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });

    if (req.log) req.log.info({ customerId: req.params.id }, 'Customer soft deleted');
    await logAudit(req, 'DELETE', req.params.id);

    res.status(204).send();
  } catch (error) {
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export const customersRouter = router;
