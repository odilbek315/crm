import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const isProduction = process.env.NODE_ENV === 'production';
const generatedDevJwtSecret = crypto.randomBytes(32).toString('hex');
const generatedDevRefreshSecret = crypto.randomBytes(32).toString('hex');

function getSecret(name: 'JWT_SECRET' | 'REFRESH_SECRET', developmentSecret: string) {
  const value = process.env[name];
  const isPlaceholder = !value || value.startsWith('YOUR_') || value.startsWith('MY_') || value.length < 32;

  if (isPlaceholder && isProduction) {
    throw new Error(`${name} must be configured with at least 32 characters in production`);
  }

  if (isPlaceholder) {
    console.warn(`${name} is not configured securely; using an ephemeral development-only secret`);
    return developmentSecret;
  }

  return value;
}

const JWT_SECRET = getSecret('JWT_SECRET', generatedDevJwtSecret);
const REFRESH_SECRET = getSecret('REFRESH_SECRET', generatedDevRefreshSecret);

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    organizationId: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const [scheme, token] = typeof authHeader === 'string' ? authHeader.split(' ') : [];

  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256'],
    audience: 'market-erp-api',
    issuer: 'market-erp',
  }, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user as any;
    next();
  });
};

export const generateToken = (userId: string, organizationId: string, role: string) => {
  return jwt.sign({ sub: userId, userId, organizationId, role }, JWT_SECRET, {
    algorithm: 'HS256',
    audience: 'market-erp-api',
    issuer: 'market-erp',
    expiresIn: '15m',
  });
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(48).toString('base64url');
};

export const hashRefreshToken = (refreshToken: string) => {
  return crypto.createHmac('sha256', REFRESH_SECRET).update(refreshToken).digest('hex');
};

export const hashOneTimeToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
