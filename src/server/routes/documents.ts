import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().optional(),
  size: z.number().int().nonnegative(),
  url: z.string().optional().nullable(),
  status: z.string().optional()
});

// GET /api/documents
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const documents = await prisma.document.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /api/documents
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = documentSchema.parse(req.body);
    const orgId = req.user!.organizationId;

    const document = await prisma.document.create({
      data: {
        ...data,
        organizationId: orgId
      }
    });

    res.status(201).json(document);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create document error:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  }
});

// DELETE /api/documents/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orgId = req.user!.organizationId;

    const existing = await prisma.document.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export const documentsRouter = router;
