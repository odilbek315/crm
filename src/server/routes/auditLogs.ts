import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken as any);

// GET /api/audit-logs
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        organizationId: orgId
      },
      orderBy: { timestamp: 'desc' },
      take: 100 // Limit to last 100 entries for performance
    });

    // Parse the changes field from JSON string to object
    const logs = auditLogs.map(log => {
      let parsedChanges = null;
      try {
        if (log.changes) {
          parsedChanges = JSON.parse(log.changes);
        }
      } catch (e) {
        parsedChanges = log.changes;
      }
      return {
        id: log.id,
        userId: log.userId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        timestamp: log.timestamp,
        changes: parsedChanges
      };
    });

    res.json(logs);
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export const auditLogsRouter = router;
