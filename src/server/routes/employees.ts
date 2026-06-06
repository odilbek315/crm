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

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    const where = {
      organizationId: req.user!.organizationId,
      deletedAt: null
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      data: employees,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = employeeSchema.parse(req.body);
    const employee = await prisma.employee.create({
      data: { ...data, organizationId: req.user!.organizationId }
    });
    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to create employee' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = employeeSchema.partial().parse(req.body);
    const existing = await prisma.employee.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Employee not found' });

    const employee = await prisma.employee.update({ where: { id: req.params.id }, data });
    res.json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to update employee' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.employee.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Employee not found' });

    await prisma.employee.update({ 
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export const employeesRouter = router;
