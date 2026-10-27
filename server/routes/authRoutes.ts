import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, addUser, User, getUserEntitlements } from '../db';
import { generateToken, requireAuth, AuthRequest } from '../auth';

export const authRouter = Router();

// Rate limiting in-memory store for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function isRateLimited(ip: string): boolean {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  // If more than 15 attempts within 10 minutes, throttle
  if (Date.now() - record.lastAttempt > 10 * 60 * 1000) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count > 15;
}

function recordAttempt(ip: string) {
  const record = loginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  record.count += 1;
  record.lastAttempt = Date.now();
  loginAttempts.set(ip, record);
}

// POST /api/auth/register
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Please provide email, password, and name.' });
      return;
    }

    const trimmedEmail = String(email).toLowerCase().trim();
    if (!trimmedEmail.includes('@') || trimmedEmail.length < 5) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (String(password).length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const existingUser = findUserByEmail(trimmedEmail);
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: trimmedEmail,
      passwordHash,
      name: String(name).trim(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    const token = generateToken(newUser);

    // Set secure cookie
    res.cookie('cn_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
      entitlements: [],
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      res.status(429).json({ error: 'Too many login attempts. Please wait 10 minutes before retrying.' });
      return;
    }

    const { email, password } = req.body;
    if (!email || !password) {
      recordAttempt(ip);
      res.status(400).json({ error: 'Please enter both email and password.' });
      return;
    }

    const trimmedEmail = String(email).toLowerCase().trim();
    const user = findUserByEmail(trimmedEmail);
    if (!user) {
      recordAttempt(ip);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      recordAttempt(ip);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Login successful - generate JWT
    const token = generateToken(user);
    const entitlements = getUserEntitlements(user.id);

    res.cookie('cn_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      entitlements: entitlements.map(e => e.productId),
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }
  const entitlements = getUserEntitlements(req.user.id);
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
    entitlements: entitlements.map(e => e.productId),
  });
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('cn_auth_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});
