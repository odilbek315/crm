import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().optional(),
  size: z.number().optional(),
  url: z.string().optional().nullable(),
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

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.document.count({ where })
    ]);

    res.json({
      data: documents,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = documentSchema.parse(req.body);
    const document = await prisma.document.create({
      data: { ...data, organizationId: req.user!.organizationId }
    });
    res.status(201).json(document);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to create document' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = documentSchema.partial().parse(req.body);
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Document not found' });

    const document = await prisma.document.update({ where: { id: req.params.id }, data });
    res.json(document);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else res.status(500).json({ error: 'Failed to update document' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Document not found' });

    await prisma.document.update({ 
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export const documentsRouter = router;
