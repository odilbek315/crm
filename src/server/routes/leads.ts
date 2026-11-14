import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const leadSchema = z.object({
  name: z.string().min(1, 'Contact Name is required'),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.string().optional(),
  score: z.number().optional()
});

// GET /api/leads
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const leads = await prisma.lead.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/leads/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orgId = req.user!.organizationId;

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Fetch lead detail error:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST /api/leads
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = leadSchema.parse(req.body);
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const lead = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.lead.create({
        data: {
          ...data,
          organizationId: orgId
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'CREATE_LEAD',
          entityType: 'Lead',
          entityId: createdLead.id,
          changes: JSON.stringify(createdLead),
          organizationId: orgId
        }
      });

      return createdLead;
    });

    res.status(201).json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create lead error:', error);
      res.status(500).json({ error: 'Failed to create lead' });
    }
  }
});

// PATCH /api/leads/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = leadSchema.partial().parse(req.body);
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const existing = await prisma.lead.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const updatedLead = await prisma.$transaction(async (tx) => {
      const updated = await tx.lead.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_LEAD',
          entityType: 'Lead',
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

    res.json(updatedLead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Update lead error:', error);
      res.status(500).json({ error: 'Failed to update lead' });
    }
  }
});

// DELETE /api/leads/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const existing = await prisma.lead.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.lead.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'DELETE_LEAD',
          entityType: 'Lead',
          entityId: id,
          changes: JSON.stringify({ deletedAt: new Date() }),
          organizationId: orgId
        }
      });
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export const leadsRouter = router;
