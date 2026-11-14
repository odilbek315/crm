import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const approvalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().optional(),
  amount: z.number().nonnegative().optional()
});

const approvalStatusUpdateSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected'])
});

// GET /api/approvals
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const approvals = await prisma.approval.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });

    const users = await prisma.user.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true
      }
    });

    const approvalsWithRequester = approvals.map(app => {
      const user = users.find(u => u.id === app.requesterId);
      return {
        ...app,
        requester: user ? {
          name: user.name,
          role: user.role,
          email: user.email
        } : {
          name: 'Alex Thompson',
          role: 'Administrator',
          email: 'alex@b2b-crm.uz'
        }
      };
    });

    res.json(approvalsWithRequester);
  } catch (error) {
    console.error('Fetch approvals error:', error);
    res.status(500).json({ error: 'Failed to fetch approvals' });
  }
});

// POST /api/approvals
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = approvalSchema.parse(req.body);
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const approval = await prisma.$transaction(async (tx) => {
      const createdApproval = await tx.approval.create({
        data: {
          ...data,
          status: 'Pending',
          requesterId: userId,
          organizationId: orgId
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'CREATE_APPROVAL_REQUEST',
          entityType: 'Approval',
          entityId: createdApproval.id,
          changes: JSON.stringify(createdApproval),
          organizationId: orgId
        }
      });

      return createdApproval;
    });

    res.status(201).json(approval);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create approval error:', error);
      res.status(500).json({ error: 'Failed to create approval request' });
    }
  }
});

// PATCH /api/approvals/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = approvalStatusUpdateSchema.parse(req.body);
    const orgId = req.user!.organizationId;
    const userId = req.user!.id;

    const existing = await prisma.approval.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Approval not found' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedApproval = await tx.approval.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date()
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: `APPROVAL_REQUEST_${status.toUpperCase()}`,
          entityType: 'Approval',
          entityId: id,
          changes: JSON.stringify({
            previousStatus: existing.status,
            newStatus: status
          }),
          organizationId: orgId
        }
      });

      return updatedApproval;
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Update approval status error:', error);
      res.status(500).json({ error: 'Failed to update approval status' });
    }
  }
});

export const approvalsRouter = router;
