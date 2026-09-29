import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Attempt loading from root or current dir
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default(process.env.NODE_ENV === 'test' ? 'test' : 'development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default('postgresql://kc:kc@localhost:5432/kc?schema=public'),
  JWT_SECRET: z.string().default('change-me-to-a-secure-random-secret-at-least-32-chars'),
  JWT_COLLECTOR_TTL: z.string().default('30d'),
  JWT_STAFF_TTL: z.string().default('12h'),
  DEMO_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true' || val === '1'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:4000')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  UPLOAD_DIR: z.string().default('./uploads'),
  UPLOAD_MAX_BYTES: z.coerce.number().default(1048576),
  DEFAULT_STATE_CODE: z.string().default('MH'),
  PUBLIC_API_BASE: z.string().default('/api/v1'),
  RATE_LIMIT_AUTH_PER_15MIN: z.coerce.number().default(20),
  SEED_DEMO_PASSWORD: z.string().default('Demo@1234'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

// In non-dev, refuse to start if the secret is shorter than 32 characters or equals 'change-me'
if (parsed.data.NODE_ENV !== 'development' && parsed.data.NODE_ENV !== 'test') {
  if (parsed.data.JWT_SECRET.length < 32 || parsed.data.JWT_SECRET === 'change-me') {
    console.error('❌ JWT_SECRET must be at least 32 characters and cannot be "change-me" in non-development modes.');
    process.exit(1);
  }
}

export const config = parsed.data;
