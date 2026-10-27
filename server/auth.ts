import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById, User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'civilnotes_super_secure_jwt_secret_2026_prod';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function extractToken(req: Request): string | null {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  // 2. Check Cookie
  if (req.cookies && req.cookies.cn_auth_token) {
    return req.cookies.cn_auth_token;
  }
  return null;
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }

  const user = findUserById(payload.id);
  if (!user) {
    res.status(401).json({ error: 'User account not found.' });
    return;
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Access forbidden: Administrator privileges required.' });
      return;
    }
    next();
  });
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload && payload.id) {
      const user = findUserById(payload.id);
      if (user) {
        req.user = user;
      }
    }
  }
  next();
}
