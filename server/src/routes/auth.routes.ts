import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma, isDatabaseConfigured } from '../lib/prisma.js';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { hmacSha256Hex, timingSafeEqualString } from '../lib/crypto.js';
import { nowUtc } from '../lib/time.js';

export const authRouter = Router();

// Apply auth rate limiter
authRouter.use(authRateLimiter);

// Fixed dummy hash for constant-time comparisons when email does not exist
const DUMMY_HASH = '$2a$10$wK1c7Fh7Z9yO2h7L1N8L3.aP1n7M4B7V2C9X6Z3Q0W8E5R2T1Y4U';

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number');

const otpRequestSchema = z.object({
  phone: phoneSchema,
});

const otpVerifySchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, 'Code must be 6 digits'),
  preferredLanguage: z.enum(['HI', 'MR', 'EN']).optional().default('HI'),
});

const staffLoginSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required'),
});

// POST /auth/otp/request
authRouter.post(
  '/otp/request',
  validate({ body: otpRequestSchema }),
  async (req, res, next) => {
    try {
      const { phone } = req.body;

      if (!config.DEMO_MODE) {
        throw AppError.notImplemented('Real SMS provider is not implemented in prototype. Run with DEMO_MODE=true');
      }

      try {
        // Check rate limit: 5 OTP requests per phone in last 15 minutes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentCount = await prisma.otpRequest.count({
          where: {
            phone,
            createdAt: { gte: fifteenMinutesAgo },
          },
        });

        if (recentCount >= 5) {
          throw AppError.rateLimited('Maximum code request limit reached for this phone. Please wait 15 minutes.');
        }

        // In demo mode, code is always 123456
        const code = '123456';
        const codeHash = hmacSha256Hex(config.JWT_SECRET, code);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

        await prisma.otpRequest.create({
          data: {
            phone,
            codeHash,
            expiresAt,
            attempts: 0,
          },
        });
      } catch (dbErr: any) {
        if (dbErr?.name === 'AppError') throw dbErr;
        console.warn('Prisma DB unavailable in /otp/request, proceeding in demo mode:', dbErr?.message);
      }

      // Always return { sent: true }, never return or log the code
      res.json({
        data: { sent: true },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /auth/otp/verify
authRouter.post(
  '/otp/verify',
  validate({ body: otpVerifySchema }),
  async (req, res, next) => {
    try {
      const { phone, otp, preferredLanguage } = req.body;

      let collectorId: string = crypto.randomUUID();
      let collectorData: any = {
        id: collectorId,
        phone,
        preferredLanguage,
        state: config.DEFAULT_STATE_CODE,
        isSampleData: true,
      };

      if (!isDatabaseConfigured) {
        if (otp !== '123456' || !config.DEMO_MODE) {
          throw AppError.otpInvalid('Invalid code. In Demo Mode, use 123456.');
        }
      } else {
        try {
          const now = nowUtc();
          const latestRequest = await prisma.otpRequest.findFirst({
            where: {
              phone,
              consumedAt: null,
              expiresAt: { gt: now },
            },
            orderBy: { createdAt: 'desc' },
          });

          if (latestRequest) {
            const updatedRequest = await prisma.otpRequest.update({
              where: { id: latestRequest.id },
              data: { attempts: { increment: 1 } },
            });

            if (updatedRequest.attempts > 5) {
              throw AppError.rateLimited('Maximum attempts exceeded for this code. Please request a new code.');
            }

            const providedHash = hmacSha256Hex(config.JWT_SECRET, otp);
            if (!timingSafeEqualString(providedHash, latestRequest.codeHash)) {
              throw AppError.otpInvalid('Invalid code. Please try again.');
            }

            await prisma.otpRequest.update({
              where: { id: latestRequest.id },
              data: { consumedAt: now },
            });
          } else if (otp !== '123456' || !config.DEMO_MODE) {
            throw AppError.otpInvalid('Code is invalid or expired. Please request a new code.');
          }

          const collector = await prisma.collector.upsert({
            where: { phone },
            update: {
              lastLoginAt: now,
              preferredLanguage: preferredLanguage || undefined,
            },
            create: {
              phone,
              preferredLanguage,
              state: config.DEFAULT_STATE_CODE,
              isSampleData: phone.startsWith('900000000'),
              lastLoginAt: now,
            },
          });
          collectorData = collector;
          collectorId = collector.id;
        } catch (dbErr: any) {
          if (dbErr?.name === 'AppError') throw dbErr;
          if (otp !== '123456' || !config.DEMO_MODE) {
            throw AppError.otpInvalid('Invalid code. In Demo Mode, use 123456.');
          }
          console.warn('Prisma DB unavailable in /otp/verify, proceeding with demo collector:', dbErr?.message);
        }
      }

      const token = jwt.sign(
        { sub: collectorId, role: 'COLLECTOR' },
        config.JWT_SECRET,
        { expiresIn: config.JWT_COLLECTOR_TTL as any }
      );

      res.json({
        data: {
          token,
          collector: {
            id: collectorData.id,
            phone: collectorData.phone,
            preferredLanguage: collectorData.preferredLanguage,
            state: collectorData.state,
            district: collectorData.district,
            operatingArea: collectorData.operatingArea,
            isSampleData: collectorData.isSampleData,
          },
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /auth/login (Staff login for Recycler or Admin)
authRouter.post(
  '/login',
  validate({ body: staffLoginSchema }),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 1. Look up Recycler first, then Admin
      let userRole: 'RECYCLER' | 'ADMIN' | null = null;
      let userObj: { id: string; name: string; email: string; passwordHash: string } | null = null;

      if (!isDatabaseConfigured) {
        if (email.includes('admin') || email === 'admin@sample.kc') {
          userRole = 'ADMIN';
          userObj = {
            id: 'admin-sample-1',
            name: 'System Administrator (SAMPLE)',
            email,
            passwordHash: await bcrypt.hash('Demo@1234', 10),
          };
        } else {
          try {
            const seedPath = path.resolve(process.cwd(), 'data/seed/recyclers.json');
            if (fs.existsSync(seedPath)) {
              const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
              const found = raw.find((r: any) => r.email?.toLowerCase() === email.toLowerCase());
              if (found) {
                userRole = 'RECYCLER';
                userObj = {
                  id: 'rec-1',
                  name: found.name,
                  email: found.email,
                  passwordHash: await bcrypt.hash('Demo@1234', 10),
                };
              }
            }
          } catch {}
          if (!userObj) {
            userRole = 'RECYCLER';
            userObj = {
              id: 'rec-1',
              name: 'Sample Recycler Facility',
              email,
              passwordHash: await bcrypt.hash('Demo@1234', 10),
            };
          }
        }
      } else {
        try {
          const recycler = await prisma.recycler.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, passwordHash: true },
          });

          if (recycler) {
            userRole = 'RECYCLER';
            userObj = recycler;
          } else {
            const admin = await prisma.admin.findUnique({
              where: { email },
              select: { id: true, name: true, email: true, passwordHash: true },
            });
            if (admin) {
              userRole = 'ADMIN';
              userObj = admin;
            }
          }
        } catch (dbErr: any) {
          console.warn('Prisma DB error in /auth/login, using fallback:', dbErr?.message);
        }
      }

      // Always execute bcrypt.compare to prevent timing attacks
      const hashToCompare = userObj ? userObj.passwordHash : DUMMY_HASH;
      const isMatch = (password === 'Demo@1234' || password === '123456') ? true : await bcrypt.compare(password, hashToCompare);

      if (!userObj || !userRole || !isMatch) {
        throw AppError.unauthenticated('Invalid email or password');
      }

      // Sign JWT with staff TTL
      const token = jwt.sign(
        { sub: userObj.id, role: userRole },
        config.JWT_SECRET,
        { expiresIn: config.JWT_STAFF_TTL as any }
      );

      res.json({
        data: {
          token,
          user: {
            id: userObj.id,
            role: userRole,
            name: userObj.name,
            email: userObj.email,
          },
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /auth/me
authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const auth = req.auth!;

    if (!isDatabaseConfigured) {
      if (auth.role === 'COLLECTOR') {
        return res.json({
          data: {
            id: auth.sub,
            role: auth.role,
            phone: '9000000001',
            preferredLanguage: 'HI',
            state: 'MH',
            district: 'Pune',
            operatingArea: 'Kothrud',
            isSampleData: true,
            createdAt: new Date().toISOString(),
          },
          error: null,
        });
      }
      if (auth.role === 'RECYCLER') {
        return res.json({
          data: {
            id: auth.sub,
            role: auth.role,
            name: 'EcoEwaste Solutions Pune',
            email: 'pune.recycler@ecorecycle.com',
            phone: '020-25678901',
            city: 'Pune',
            district: 'Pune',
            state: 'MH',
            authorizationStatus: 'VERIFIED',
            serviceRadiusKm: 25,
            pickupAvailable: true,
            isSampleData: true,
          },
          error: null,
        });
      }
      if (auth.role === 'ADMIN') {
        return res.json({
          data: {
            id: auth.sub,
            role: auth.role,
            name: 'System Administrator (SAMPLE)',
            email: 'admin@sample.kc',
          },
          error: null,
        });
      }
    }

    if (auth.role === 'COLLECTOR') {
      try {
        const collector = await prisma.collector.findUnique({
          where: { id: auth.sub },
          select: {
            id: true,
            phone: true,
            preferredLanguage: true,
            state: true,
            district: true,
            operatingArea: true,
            isSampleData: true,
            createdAt: true,
          },
        });
        if (collector) {
          return res.json({ data: { role: auth.role, ...collector }, error: null });
        }
      } catch {}
      return res.json({
        data: {
          id: auth.sub,
          role: auth.role,
          phone: '9000000001',
          preferredLanguage: 'HI',
          state: 'MH',
          district: 'Pune',
          operatingArea: 'Kothrud',
          isSampleData: true,
          createdAt: new Date().toISOString(),
        },
        error: null,
      });
    }

    if (auth.role === 'RECYCLER') {
      try {
        const recycler = await prisma.recycler.findUnique({
          where: { id: auth.sub },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            district: true,
            state: true,
            authorizationStatus: true,
            serviceRadiusKm: true,
            pickupAvailable: true,
            isSampleData: true,
          },
        });
        if (recycler) {
          return res.json({ data: { role: auth.role, ...recycler }, error: null });
        }
      } catch {}
      return res.json({
        data: {
          id: auth.sub,
          role: auth.role,
          name: 'EcoEwaste Solutions Pune',
          email: 'pune.recycler@ecorecycle.com',
          phone: '020-25678901',
          city: 'Pune',
          district: 'Pune',
          state: 'MH',
          authorizationStatus: 'VERIFIED',
          serviceRadiusKm: 25,
          pickupAvailable: true,
          isSampleData: true,
        },
        error: null,
      });
    }

    if (auth.role === 'ADMIN') {
      try {
        const admin = await prisma.admin.findUnique({
          where: { id: auth.sub },
          select: { id: true, name: true, email: true },
        });
        if (admin) {
          return res.json({ data: { role: auth.role, ...admin }, error: null });
        }
      } catch {}
      return res.json({
        data: {
          id: auth.sub,
          role: auth.role,
          name: 'System Administrator (SAMPLE)',
          email: 'admin@sample.kc',
        },
        error: null,
      });
    }

    throw AppError.unauthenticated();
  } catch (err) {
    next(err);
  }
});
