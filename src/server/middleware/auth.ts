import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
    
    // Attach the parsed identity to the request
    req.user = {
      id: decoded.id || decoded.userId,
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };
    
    // Verify that the organization still exists in the database
    try {
      const orgExists = await prisma.organization.findUnique({
        where: { id: decoded.organizationId }
      });
      if (!orgExists) {
        return res.status(401).json({ error: 'Unauthorized: Organization no longer exists. Please log in again.' });
      }
    } catch (dbErr) {
      console.error('Auth middleware DB verification error:', dbErr);
    }
    
    next();
  });
};

export const generateToken = (userId: string, organizationId: string, role: string, email: string) => {
  return jwt.sign(
    { 
      id: userId,
      userId, 
      organizationId, 
      role, 
      email 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
};
