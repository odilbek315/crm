import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  department: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  status: z.string().optional()
});

// GET /api/employees
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const employees = await prisma.employee.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(employees);
  } catch (error) {
    console.error('Fetch employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/employees
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = employeeSchema.parse(req.body);
    const orgId = req.user!.organizationId;

    const employee = await prisma.employee.create({
      data: {
        ...data,
        organizationId: orgId
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create employee error:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }
});

// PATCH /api/employees/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = employeeSchema.partial().parse(req.body);
    const orgId = req.user!.organizationId;

    const existing = await prisma.employee.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Update employee error:', error);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orgId = req.user!.organizationId;

    const existing = await prisma.employee.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export const employeesRouter = router;
