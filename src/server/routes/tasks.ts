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

// GET /api/tasks
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const tasks = await prisma.task.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = taskSchema.parse(req.body);
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const task = await prisma.$transaction(async (tx) => {
      const createdTask = await tx.task.create({
        data: {
          ...data,
          organizationId: orgId
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'CREATE_TASK',
          entityType: 'Task',
          entityId: createdTask.id,
          changes: JSON.stringify(createdTask),
          organizationId: orgId
        }
      });

      return createdTask;
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = taskSchema.partial().parse(req.body);
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const existing = await prisma.task.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_TASK',
          entityType: 'Task',
          entityId: id,
          changes: JSON.stringify({
            before: existing,
            after: updated
          }),
          organizationId: orgId
        }
      });

      return updated;
    });

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const existing = await prisma.task.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'DELETE_TASK',
          entityType: 'Task',
          entityId: id,
          changes: JSON.stringify({ deletedAt: new Date() }),
          organizationId: orgId
        }
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export const tasksRouter = router;
