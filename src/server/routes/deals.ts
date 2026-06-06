import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.number().optional(),
  stage: z.string().optional(),
  expectedClose: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  customerId: z.string().optional().nullable()
});

const dealInclude = {
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      status: true,
      value: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      organizationId: true,
    },
  },
};

function sanitizeDealCustomer<T extends { customer?: { organizationId: string } | null }>(
  deal: T,
  organizationId: string,
) {
  return {
    ...deal,
    customer: deal.customer?.organizationId === organizationId ? deal.customer : null,
  };
}

async function assertCustomerInOrganization(customerId: string | null | undefined, organizationId: string) {
  if (!customerId) return;

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      organizationId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!customer) {
    throw new Error('CUSTOMER_NOT_FOUND');
  }
}

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    const where = {
      organizationId: req.user!.organizationId,
      deletedAt: null
    };

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: dealInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.deal.count({ where })
    ]);

    res.json({
      data: deals.map(deal => sanitizeDealCustomer(deal, req.user!.organizationId)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deal = await prisma.deal.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null },
      include: dealInclude
    });
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json(sanitizeDealCustomer(deal, req.user!.organizationId));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = dealSchema.parse(req.body);
    await assertCustomerInOrganization(data.customerId, req.user!.organizationId);
    const deal = await prisma.deal.create({
      data: { ...data, organizationId: req.user!.organizationId }
    });
    res.status(201).json(deal);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') res.status(400).json({ error: 'Customer does not belong to this organization' });
    else res.status(500).json({ error: 'Failed to create deal' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = dealSchema.partial().parse(req.body);
    await assertCustomerInOrganization(data.customerId, req.user!.organizationId);
    const existing = await prisma.deal.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Deal not found' });

    const deal = await prisma.deal.update({ where: { id: req.params.id }, data });
    res.json(deal);
  } catch (error) {
    if (error instanceof z.ZodError) res.status(400).json({ error: error.issues });
    else if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') res.status(400).json({ error: 'Customer does not belong to this organization' });
    else res.status(500).json({ error: 'Failed to update deal' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.deal.findFirst({
      where: { id: req.params.id, organizationId: req.user!.organizationId, deletedAt: null }
    });
    if (!existing) return res.status(404).json({ error: 'Deal not found' });

    await prisma.deal.update({ 
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

export const dealsRouter = router;
