import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Middleware to ensure the user is an ADMIN
router.use(authenticateToken as any);
router.use((req: AuthenticatedRequest, res: Response, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
});

const allowedModels = ['customer', 'lead', 'deal', 'task', 'document', 'employee'];

router.post('/restore/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { model, id } = req.params;
  
  if (!allowedModels.includes(model)) {
    return res.status(400).json({ error: 'Invalid model' });
  }

  try {
    const delegate = (prisma as any)[model];
    
    // Ensure the record belongs to the user's organization
    const existing = await delegate.findFirst({
      where: { id, organizationId: req.user!.organizationId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const restored = await delegate.update({
      where: { id },
      data: { deletedAt: null }
    });

    res.json(restored);
  } catch (error) {
    res.status(500).json({ error: `Failed to restore ${model}` });
  }
});

router.delete('/permanent/:model/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { model, id } = req.params;
  
  if (!allowedModels.includes(model)) {
    return res.status(400).json({ error: 'Invalid model' });
  }

  try {
    const delegate = (prisma as any)[model];
    
    // Ensure the record belongs to the user's organization
    const existing = await delegate.findFirst({
      where: { id, organizationId: req.user!.organizationId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await delegate.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Failed to permanently delete ${model}` });
  }
});

export const adminRouter = router;
