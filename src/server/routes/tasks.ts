import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null)
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

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      data: tasks,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = taskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: { ...data, organizationId: req.user!.organizationId }
    });
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to create task' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = taskSchema.partial().parse(req.body);
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const task = await prisma.task.update({ where: { id: req.params.id }, data });
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await prisma.task.update({ 
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export const tasksRouter = router;
