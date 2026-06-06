import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../prisma';
import {
  generateToken,
  generateRefreshToken,
  hashRefreshToken,
  hashOneTimeToken,
  AuthenticatedRequest,
  authenticateToken,
} from '../middleware/auth';

const router = Router();

// Used when creating a refresh token in DB
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const authUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  organizationId: true,
  organization: {
    select: {
      name: true,
    },
  },
  passwordHash: true,
  deletedAt: true,
};

const publicUser = (
  user: { id: string; name: string; email: string; role: string; organizationId: string },
  organizationName?: string,
) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  organizationId: user.organizationId,
  organizationName,
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).transform(email => email.toLowerCase()),
  password: z.string().min(8).max(128),
  organizationName: z.string().trim().min(2).max(120),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255).transform(email => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(32).max(256),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255).transform(email => email.toLowerCase()),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, organizationName } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
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
    const token = generateToken(user.id, organization.id, user.role);
    const refreshToken = generateRefreshToken();

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * REFRESH_TOKEN_EXPIRY_DAYS)
      }
    });

    res.status(201).json({
      token,
      refreshToken,
      user: publicUser(user, organization.name)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      select: authUserSelect,
    });
    if (!user || user.deletedAt) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.organizationId, user.role);
    const refreshToken = generateRefreshToken();

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * REFRESH_TOKEN_EXPIRY_DAYS)
      }
    });

    res.json({
      token,
      refreshToken,
      user: publicUser(user, user.organization.name)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const session = await prisma.session.findUnique({
      where: { refreshToken: hashRefreshToken(refreshToken) },
      include: {
        user: {
          include: {
            organization: {
              select: { name: true },
            },
          },
        },
      }
    });

    if (!session || session.expiresAt < new Date() || session.user.deletedAt) {
      if (session) await prisma.session.delete({ where: { id: session.id } });
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const token = generateToken(session.user.id, session.user.organizationId, session.user.role);
    
    // Rotate refresh token
    const newRefreshToken = generateRefreshToken();
    await prisma.session.update({
      where: { id: session.id },
      data: { 
        refreshToken: hashRefreshToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * REFRESH_TOKEN_EXPIRY_DAYS)
      }
    });

    res.json({ token, refreshToken: newRefreshToken, user: publicUser(session.user, session.user.organization?.name) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await prisma.session.delete({ where: { refreshToken: hashRefreshToken(refreshToken) } }).catch(() => {});
    } else {
      // Optional: purge all sessions for user
      await prisma.session.deleteMany({ where: { userId: req.user!.userId } });
    }
    res.status(204).send();
  } catch (error) {
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && !user.deletedAt) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: hashOneTimeToken(resetToken),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
        }
      });
      // In production, send email via SendGrid/SES here
      if (req.log) req.log.info({ email }, 'Password reset requested');
    }
    // Always return success to prevent username enumeration
    res.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    
    const hashedToken = hashOneTimeToken(token);
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: hashedToken }
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    });

    if (!user || user.deletedAt) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    if (req.log) req.log.info({ email: user.email }, 'Password successfully reset');
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (req.log) req.log.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const authRouter = router;
