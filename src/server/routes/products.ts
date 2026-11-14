import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticateToken as any);

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  brand: z.string().optional().nullable(),
  status: z.string().optional()
});

// GET /api/products
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.organizationId;
    const products = await prisma.product.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = productSchema.parse(req.body);
    const orgId = req.user!.organizationId;

    // Check SKU uniqueness inside the organization
    const existingSku = await prisma.product.findFirst({
      where: {
        organizationId: orgId,
        sku: data.sku,
        deletedAt: null
      }
    });

    if (existingSku) {
      return res.status(400).json({ error: 'Product SKU already in use' });
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        organizationId: orgId
      }
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
});

// PATCH /api/products/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);
    const orgId = req.user!.organizationId;

    const existing = await prisma.product.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check SKU uniqueness if SKU is being updated
    if (data.sku && data.sku !== existing.sku) {
      const existingSku = await prisma.product.findFirst({
        where: {
          organizationId: orgId,
          sku: data.sku,
          deletedAt: null
        }
      });
      if (existingSku) {
        return res.status(400).json({ error: 'Product SKU already in use' });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orgId = req.user!.organizationId;

    const existing = await prisma.product.findFirst({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export const productsRouter = router;
