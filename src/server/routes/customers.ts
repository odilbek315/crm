import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Apply auth middleware to all customer routes
router.use(authenticateToken as any);

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  status: z.string().optional(),
  value: z.number().optional()
});

// GET /api/customers - Paginated, multi-tenant filter, soft delete filter
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit as string || '10', 10));
    const skip = (page - 1) * limit;
    const organizationId = req.user!.organizationId;

    // Parallel execution of count and paginated query
    const [customers, totalItems] = await Promise.all([
      prisma.customer.findMany({
        where: {
          organizationId,
          deletedAt: null
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customer.count({
        where: {
          organizationId,
          deletedAt: null
        }
      })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      data: customers,
      meta: {
        totalItems,
        totalPages,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id - Single customer fetch, multi-tenant filter, soft delete filter
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
        deletedAt: null
      }
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST /api/customers - Create customer with AuditLog transaction
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = customerSchema.parse(req.body);
    const userId = req.user!.id;
    const organizationId = req.user!.organizationId;

    // Use isolated database transaction
    const customer = await prisma.$transaction(async (tx) => {
      // 1. Create the customer record
      const createdCustomer = await tx.customer.create({
        data: {
          ...data,
          organizationId
        }
      });

      // 2. Create AuditLog entry
      await tx.auditLog.create({
        data: {
          userId,
          action: 'CREATE_CUSTOMER',
          entityType: 'Customer',
          entityId: createdCustomer.id,
          changes: JSON.stringify(createdCustomer),
          organizationId
        }
      });

      return createdCustomer;
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create customer error:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
});

// PATCH /api/customers/:id - Update customer, multi-tenant isolation, soft delete check
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = customerSchema.partial().parse(req.body);
    const organizationId = req.user!.organizationId;
    
    // Check if customer exists and belongs to the organization and is not deleted
    const existing = await prisma.customer.findFirst({
      where: {
        id: req.params.id,
        organizationId,
        deletedAt: null
      }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data
    });
    res.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Update customer error:', error);
      res.status(500).json({ error: 'Failed to update customer' });
    }
  }
});

// DELETE /api/customers/:id - Soft Delete, multi-tenant isolation, soft delete check
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;
    
    // Check if customer exists and belongs to the organization and is not deleted
    const existing = await prisma.customer.findFirst({
      where: {
        id: req.params.id,
        organizationId,
        deletedAt: null
      }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Perform soft delete (set deletedAt to now)
    await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export const customersRouter = router;
