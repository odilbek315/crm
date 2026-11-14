import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password, organizationName } = req.body;
  
  try {
    // Check if user exists and is not deleted
    const existingUser = await prisma.user.findFirst({
      where: { 
        email,
        deletedAt: null
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await prisma.organization.create({
      data: {
        name: organizationName || `${name}'s Organization`,
        users: {
          create: {
            email,
            name,
            passwordHash: hashedPassword,
            role: 'Administrator',
          }
        }
      },
      include: {
        users: true
      }
    });

    const user = organization.users[0];
    const token = generateToken(user.id, organization.id, user.role, user.email);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Lookup users where email matches and deletedAt is null
    const user = await prisma.user.findFirst({ 
      where: { 
        email,
        deletedAt: null 
      } 
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.organizationId, user.role, user.email);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/organizations - List available organizations
router.get('/organizations', authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true }
    });
    res.json(orgs);
  } catch (error) {
    console.error('Fetch organizations error:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// POST /api/auth/switch-tenant - Switch current organization
router.post('/switch-tenant', authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  const { organizationId } = req.body;
  const userId = req.user!.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Generate a new token with the new organizationId
    const token = generateToken(user.id, org.id, user.role, user.email);
    res.json({ token });
  } catch (error) {
    console.error('Switch tenant error:', error);
    res.status(500).json({ error: 'Failed to switch tenant' });
  }
});

export const authRouter = router;
