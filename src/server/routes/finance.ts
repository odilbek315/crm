import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { workflowEngine } from '../services/workflowEngine';
import { z } from 'zod';

const router = Router();

// Apply authentication middleware to all finance routes
router.use(authenticateToken as any);

const invoiceCreateSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  dueDate: z.string().transform((str) => new Date(str)),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be greater than 0')
    })
  ).min(1, 'Invoice must contain at least one item')
});

// GET /api/finance/dashboard or GET /api/finance/metrics
// Returns dynamic financial stats aggregated from the database
router.get(['/dashboard', '/metrics'], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;

    // 1. Calculate Total Revenue from PAID Invoices
    const revenueAggregate = await prisma.invoice.aggregate({
      where: {
        organizationId,
        status: 'Paid',
        deletedAt: null
      },
      _sum: {
        amount: true
      }
    });
    const totalRevenue = revenueAggregate._sum.amount || 0;

    // 2. Calculate Outstanding Receivables from UNPAID / OVERDUE Invoices
    const receivablesAggregate = await prisma.invoice.aggregate({
      where: {
        organizationId,
        status: {
          in: ['Unpaid', 'Overdue']
        },
        deletedAt: null
      },
      _sum: {
        amount: true
      }
    });
    const outstandingReceivables = receivablesAggregate._sum.amount || 0;

    // 3. Count status groups to get Paid vs Unpaid ratios
    const statusGroups = await prisma.invoice.groupBy({
      by: ['status'],
      where: {
        organizationId,
        deletedAt: null
      },
      _count: {
        id: true
      }
    });

    const statusCounts = statusGroups.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    const paidCount = statusCounts['Paid'] || 0;
    const unpaidCount = statusCounts['Unpaid'] || 0;
    const overdueCount = statusCounts['Overdue'] || 0;
    const totalInvoicesCount = paidCount + unpaidCount + overdueCount;
    const paidRatio = totalInvoicesCount > 0 ? (paidCount / totalInvoicesCount) * 100 : 0;

    // 4. Inventory Valuation: Sum of (price * stock) for all active products
    const products = await prisma.product.findMany({
      where: {
        organizationId,
        deletedAt: null
      }
    });
    const inventoryValuation = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

    // 5. Dynamic Cash Flow Data (last 6 months of Paid vs Unpaid/Overdue Invoices)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of the month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentInvoices = await prisma.invoice.findMany({
      where: {
        organizationId,
        deletedAt: null,
        createdAt: {
          gte: sixMonthsAgo
        }
      }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const cashFlowMap: Record<string, { month: string, income: number, expense: number }> = {};

    // Initialize map for the last 6 months in chronological order
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()];
      cashFlowMap[monthName] = { month: monthName, income: 0, expense: 0 };
    }

    recentInvoices.forEach(inv => {
      const monthName = months[inv.createdAt.getMonth()];
      if (cashFlowMap[monthName]) {
        if (inv.status === 'Paid') {
          cashFlowMap[monthName].income += inv.amount;
        } else {
          // Unpaid or Overdue counted as outstanding/expected flow
          cashFlowMap[monthName].expense += inv.amount;
        }
      }
    });

    const cashFlow = Object.values(cashFlowMap);

    res.json({
      totalRevenue,
      outstandingReceivables,
      paidCount,
      unpaidCount,
      overdueCount,
      totalInvoicesCount,
      paidRatio: Math.round(paidRatio * 100) / 100,
      inventoryValuation,
      cashFlow
    });
  } catch (error) {
    console.error('Fetch finance dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch financial dashboard stats' });
  }
});

// GET /api/finance/invoices or GET /api/invoices
// Returns paginated list of invoices with customer details
router.get(['/invoices', '/'], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit as string || '10', 10));
    const skip = (page - 1) * limit;
    const organizationId = req.user!.organizationId;

    const [invoices, totalItems] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          organizationId,
          deletedAt: null
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.invoice.count({
        where: {
          organizationId,
          deletedAt: null
        }
      })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      data: invoices,
      meta: {
        totalItems,
        totalPages,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/finance/products
// Fetch products list for invoice item selection
router.get('/products', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;
    const products = await prisma.product.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/finance/invoices or POST /api/invoices
// Transaction-safe creation of an invoice, deducting stock levels
router.post(['/invoices', '/'], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = invoiceCreateSchema.parse(req.body);
    const { customerId, dueDate, items } = parsed;
    const organizationId = req.user!.organizationId;
    const userId = req.user!.id;

    // Use transaction to ensure stock levels and amounts are calculated correctly on the backend
    const invoice = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const invoiceItemsToCreate = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: {
            id: item.productId,
            organizationId,
            deletedAt: null
          }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
        }

        // Deduct quantities from product stock levels
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
            status: (product.stock - item.quantity) === 0 ? 'Out of Stock' : 'In Stock'
          }
        });

        subtotal += product.price * item.quantity;

        invoiceItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      const taxRate = 0.1; // 10% tax rate
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      // Create invoice record
      const createdInvoice = await tx.invoice.create({
        data: {
          customerId,
          organizationId,
          amount: totalAmount,
          dueDate,
          status: 'Unpaid',
          items: {
            create: invoiceItemsToCreate
          }
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Write strict AuditLog entry
      await tx.auditLog.create({
        data: {
          userId,
          action: 'INVOICE_ISSUED',
          entityType: 'Invoice',
          entityId: createdInvoice.id,
          changes: JSON.stringify({
            invoiceId: createdInvoice.id,
            customerId,
            subtotal,
            tax: taxAmount,
            totalAmount,
            items: invoiceItemsToCreate
          }),
          organizationId
        }
      });

      return createdInvoice;
    });

    res.status(201).json(invoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create invoice error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to issue invoice' });
    }
  }
});

// PATCH /api/finance/invoices/:id/pay or PATCH /api/invoices/:id/pay
// Mark invoice as paid and trigger corresponding workflow engine event
router.patch(['/invoices/:id/pay', '/:id/pay'], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId;
    const userId = req.user!.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status === 'Paid') {
      return res.status(400).json({ error: 'Invoice is already paid' });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'Paid'
      },
      include: {
        customer: true,
        items: true
      }
    });

    // 1. Audit log the payment
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'INVOICE_PAID',
        entityType: 'Invoice',
        entityId: updatedInvoice.id,
        changes: JSON.stringify({
          amount: updatedInvoice.amount,
          paidAt: new Date()
        }),
        organizationId
      }
    });

    // 2. Trigger the WorkflowEngine event
    await workflowEngine.trigger('FINANCIAL_INVOICE_PAID', {
      invoice: updatedInvoice,
      organizationId,
      userId
    });

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Mark invoice paid error:', error);
    res.status(500).json({ error: 'Failed to process invoice payment' });
  }
});

// DELETE /api/finance/invoices/:id or DELETE /api/invoices/:id
// Soft deletes an invoice
router.delete(['/invoices/:id', '/:id'], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export const financeRouter = router;
