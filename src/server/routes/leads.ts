import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken as any);

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.string().optional(),
  score: z.number().optional()
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

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.lead.count({ where })
    ]);

    res.json({
      data: leads,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = await prisma.lead.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = leadSchema.parse(req.body);
    const lead = await prisma.lead.create({
      data: { ...data, organizationId: req.user!.organizationId }
    });
    res.status(201).json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to create lead' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = leadSchema.partial().parse(req.body);
    const existing = await prisma.lead.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Lead not found' });

    const lead = await prisma.lead.update({ where: { id: req.params.id }, data });
    res.json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to update lead' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.lead.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Lead not found' });

    await prisma.lead.update({ 
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export const leadsRouter = router;
