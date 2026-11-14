import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { workflowEngine } from '../services/workflowEngine';

const router = Router();

// Apply auth middleware to all deals routes
router.use(authenticateToken as any);

const stageUpdateSchema = z.object({
  stage: z.string().min(1, 'Stage is required'),
  notes: z.string().optional().nullable()
});

// GET /api/deals/kanban - Fetch multi-tenant scoped deals
router.get('/kanban', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;

    const deals = await prisma.deal.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      include: {
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(deals);
  } catch (error) {
    console.error('Fetch deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// GET /api/deals/:id/history - Retrieve transition history from AuditLog
router.get('/:id/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId;

    // Check if the deal exists and belongs to the organization
    const deal = await prisma.deal.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      }
    });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Fetch audit logs related to this deal
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        organizationId,
        entityType: 'Deal',
        entityId: id,
        action: 'UPDATE_DEAL_STAGE'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Parse the changes field from each log
    const history = auditLogs.map(log => {
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
        timestamp: log.timestamp,
        action: log.action,
        changes: parsedChanges
      };
    });

    res.json(history);
  } catch (error) {
    console.error('Fetch deal history error:', error);
    res.status(500).json({ error: 'Failed to fetch deal history' });
  }
});

// PATCH /api/deals/:id/stage - Update stage, record audit log, call Gemini AI
router.patch('/:id/stage', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { stage, notes } = stageUpdateSchema.parse(req.body);
    const userId = req.user!.id;
    const organizationId = req.user!.organizationId;

    // Run within a Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch deal to verify tenant isolation and get previous stage/value
      const existingDeal = await tx.deal.findFirst({
        where: {
          id,
          organizationId,
          deletedAt: null
        },
        include: {
          customer: true
        }
      });

      if (!existingDeal) {
        throw new Error('DEAL_NOT_FOUND');
      }

      const previousStage = existingDeal.stage;

      // 2. Update the deal's stage in the database
      const updatedDeal = await tx.deal.update({
        where: { id },
        data: {
          stage,
          updatedAt: new Date()
        },
        include: {
          customer: true
        }
      });

      // 3. Write details to AuditLog
      const auditLog = await tx.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_DEAL_STAGE',
          entityType: 'Deal',
          entityId: id,
          changes: JSON.stringify({
            previousStage,
            newStage: stage,
            notes: notes || '',
            dealTitle: existingDeal.title,
            dealValue: existingDeal.value
          }),
          organizationId
        }
      });

      return { updatedDeal, previousStage };
    });

    const { updatedDeal, previousStage } = result;

    // AI Forecast Integration using @google/genai
    let aiForecast = {
      winProbability: 50,
      recommendations: [
        "Mijozning ehtiyojlarini chuqurroq o'rganing va ularga moslashtirilgan yechim taklif qiling.",
        "Keyingi uchrashuv sanasini aniqlashtiring va muzokaralarni rasmiylashtiring."
      ]
    };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const prompt = `
Siz savdo bo'yicha ekspert va sun'iy intellekt yordamchisiz.
Quyidagi bitim (deal) tafsilotlarini tahlil qiling va uning muvaffaqiyatli yakunlanish ehtimolini (Win Probability, 0-100%) baholang hamda savdo menejeriga o'zbek tilida 2 ta aniq, amaliy tavsiya bering.

Bitim ma'lumotlari:
- Bitim nomi: "${updatedDeal.title}"
- Mijoz: "${updatedDeal.customer?.name || 'Noma\'lum'}"
- Bitim qiymati: $${updatedDeal.value}
- Yangi bosqich: "${stage}"
- Oldingi bosqich: "${previousStage}"
- O'tish izohi (eslatmalar): "${notes || 'Izoh qoldirilmagan'}"

Javobingizni quyidagi formatda qaytaring (faqat JSON formatida, hech qanday qo'shimcha so'zlarsiz, quyidagi kalitlar bilan):
{
  "winProbability": <ehtimollik foizi, faqat son, masalan 75>,
  "recommendations": [
    "<o'zbek tilidagi 1-tavsiya>",
    "<o'zbek tilidagi 2-tavsiya>"
  ]
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed.winProbability === 'number' && Array.isArray(parsed.recommendations)) {
            aiForecast = parsed;
          }
        }
      } catch (aiError) {
        console.error("Gemini Error:", aiError);
        // Fail silently and use fallback defaults
      }
    }

    // Trigger workflow engine triggers asynchronously
    workflowEngine.trigger('DEAL_STAGE_CHANGED', {
      deal: updatedDeal,
      organizationId,
      userId
    }).catch(err => console.error('Workflow trigger failed:', err));

    res.json({
      deal: updatedDeal,
      aiForecast
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error instanceof Error && error.message === 'DEAL_NOT_FOUND') {
      return res.status(404).json({ error: 'Deal not found' });
    }
    console.error('Update deal stage error:', error);
    res.status(500).json({ error: 'Failed to update deal stage' });
  }
});

export const dealsRouter = router;
