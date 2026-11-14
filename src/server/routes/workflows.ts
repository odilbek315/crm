import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { workflowEngine } from '../services/workflowEngine';

const router = Router();

// Apply auth middleware to all workflow routes
router.use(authenticateToken as any);

// GET /api/workflows - Return real-time list of rules
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rules = workflowEngine.getRules();
    res.json(rules);
  } catch (error) {
    console.error('Fetch workflows error:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// PATCH /api/workflows/:id/toggle - Toggle rule active state in-memory
router.patch('/:id/toggle', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedRule = workflowEngine.toggleRule(id);
    
    if (!updatedRule) {
      return res.status(404).json({ error: 'Workflow rule not found' });
    }
    
    res.json(updatedRule);
  } catch (error) {
    console.error('Toggle workflow error:', error);
    res.status(500).json({ error: 'Failed to toggle workflow' });
  }
});

// GET /api/workflows/logs - Query AuditLog for WORKFLOW_EXECUTION entries
router.get('/logs', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        organizationId,
        action: 'WORKFLOW_EXECUTION'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Parse the changes JSON field
    const logs = auditLogs.map(log => {
      let parsedDetails = null;
      try {
        if (log.changes) {
          parsedDetails = JSON.parse(log.changes);
        }
      } catch (e) {
        parsedDetails = log.changes;
      }
      return {
        id: log.id,
        userId: log.userId,
        timestamp: log.timestamp,
        details: parsedDetails
      };
    });

    res.json(logs);
  } catch (error) {
    console.error('Fetch workflow logs error:', error);
    res.status(500).json({ error: 'Failed to fetch workflow logs' });
  }
});

export const workflowsRouter = router;
