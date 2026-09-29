import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const SEED_DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || 'Demo@1234';
const projectRoot = path.resolve(__dirname, '../../');

function loadSeedJson<T>(filename: string): T {
  const filePath = path.join(projectRoot, 'data/seed', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

// Pseudo-random number generator with fixed seed for reproducible price series
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function main() {
  console.log('🌱 Starting database seed (SAMPLE DATA)...');

  // 1. Categories and Sub-categories
  console.log('📦 Seeding material categories...');
  const categoriesData = loadSeedJson<any[]>('categories.json');
  const categoryMap = new Map<string, string>(); // code -> id

  for (const cat of categoriesData) {
    const category = await prisma.materialCategory.upsert({
      where: { code: cat.code },
      update: {
        nameEn: cat.nameEn,
        nameHi: cat.nameHi,
        nameMr: cat.nameMr,
        iconKey: cat.iconKey,
        hazardLevel: cat.hazardLevel,
        unit: cat.unit,
        sortOrder: cat.sortOrder,
      },
      create: {
        code: cat.code,
        nameEn: cat.nameEn,
        nameHi: cat.nameHi,
        nameMr: cat.nameMr,
        iconKey: cat.iconKey,
        hazardLevel: cat.hazardLevel,
        unit: cat.unit,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap.set(cat.code, category.id);

    if (cat.subCategories && Array.isArray(cat.subCategories)) {
      for (const sub of cat.subCategories) {
        await prisma.materialSubCategory.upsert({
          where: {
            categoryId_code: {
              categoryId: category.id,
              code: sub.code,
            },
          },
          update: {
            nameEn: sub.nameEn,
            nameHi: sub.nameHi,
            nameMr: sub.nameMr,
            sortOrder: sub.sortOrder,
          },
          create: {
            categoryId: category.id,
            code: sub.code,
            nameEn: sub.nameEn,
            nameHi: sub.nameHi,
            nameMr: sub.nameMr,
            sortOrder: sub.sortOrder,
          },
        });
      }
    }
  }

  // 2. Admin User
  console.log('👤 Seeding admin verifier...');
  const passwordHash = await bcrypt.hash(SEED_DEMO_PASSWORD, 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@sample.kc' },
    update: {
      name: 'System Administrator (SAMPLE)',
      passwordHash,
    },
    create: {
      name: 'System Administrator (SAMPLE)',
      email: 'admin@sample.kc',
      passwordHash,
    },
  });

  // 3. Recyclers
  console.log('🏭 Seeding 8 sample recyclers...');
  const recyclersData = loadSeedJson<any[]>('recyclers.json');
  const validTill = new Date();
  validTill.setFullYear(validTill.getFullYear() + 2); // 2 years in future

  for (const r of recyclersData) {
    const isVerified = r.authorizationStatus === 'VERIFIED';
    const recycler = await prisma.recycler.upsert({
      where: { email: r.email },
      update: {
        name: r.name,
        phone: r.phone,
        address: r.address,
        city: r.city,
        district: r.district,
        state: r.state,
        lat: r.lat,
        lng: r.lng,
        serviceRadiusKm: r.serviceRadiusKm,
        pickupAvailable: r.pickupAvailable,
        authorizationNo: r.authorizationNo,
        authorizationBody: r.authorizationBody,
        authorizationValidTill: validTill,
        authorizationStatus: r.authorizationStatus,
        verifiedAt: isVerified ? new Date() : null,
        verifiedById: isVerified ? admin.id : null,
        isSampleData: true,
      },
      create: {
        name: r.name,
        email: r.email,
        passwordHash,
        phone: r.phone,
        address: r.address,
        city: r.city,
        district: r.district,
        state: r.state,
        lat: r.lat,
        lng: r.lng,
        serviceRadiusKm: r.serviceRadiusKm,
        pickupAvailable: r.pickupAvailable,
        authorizationNo: r.authorizationNo,
        authorizationBody: r.authorizationBody,
        authorizationValidTill: validTill,
        authorizationStatus: r.authorizationStatus,
        verifiedAt: isVerified ? new Date() : null,
        verifiedById: isVerified ? admin.id : null,
        isSampleData: true,
      },
    });

    // Recycler Materials
    if (r.rateMultipliers) {
      for (const [catCode, mult] of Object.entries(r.rateMultipliers)) {
        const catId = categoryMap.get(catCode);
        const catObj = categoriesData.find((c) => c.code === catCode);
        if (catId && catObj) {
          const rateVal = (parseFloat(catObj.baseRate) * (mult as number)).toFixed(2);
          await prisma.recyclerMaterial.upsert({
            where: {
              recyclerId_categoryId: {
                recyclerId: recycler.id,
                categoryId: catId,
              },
            },
            update: {
              offeredRatePerUnit: new Prisma.Decimal(rateVal),
              rateUpdatedAt: new Date(),
            },
            create: {
              recyclerId: recycler.id,
              categoryId: catId,
              offeredRatePerUnit: new Prisma.Decimal(rateVal),
              rateUpdatedAt: new Date(),
            },
          });
        }
      }
    }
  }

  // 4. Collectors
  console.log('📱 Seeding sample collectors...');
  const collectorsData = loadSeedJson<any[]>('collectors.json');
  for (const c of collectorsData) {
    await prisma.collector.upsert({
      where: { phone: c.phone },
      update: {
        preferredLanguage: c.preferredLanguage,
        state: c.state,
        district: c.district,
        operatingArea: c.operatingArea,
        isSampleData: true,
      },
      create: {
        phone: c.phone,
        preferredLanguage: c.preferredLanguage,
        state: c.state,
        district: c.district,
        operatingArea: c.operatingArea,
        isSampleData: true,
      },
    });
  }

  // 5. Safety Tips
  console.log('🛡️ Seeding safety tips...');
  const safetyTipsData = loadSeedJson<any[]>('safety-tips.json');
  for (const tip of safetyTipsData) {
    await prisma.safetyTip.upsert({
      where: { code: tip.code },
      update: {
        titleEn: tip.titleEn,
        titleHi: tip.titleHi,
        titleMr: tip.titleMr,
        bodyEn: tip.bodyEn,
        bodyHi: tip.bodyHi,
        bodyMr: tip.bodyMr,
        pictogramKey: tip.pictogramKey,
        audioKey: tip.audioKey,
        appliesToCategoryCode: tip.appliesToCategoryCode,
        sortOrder: tip.sortOrder,
      },
      create: {
        code: tip.code,
        titleEn: tip.titleEn,
        titleHi: tip.titleHi,
        titleMr: tip.titleMr,
        bodyEn: tip.bodyEn,
        bodyHi: tip.bodyHi,
        bodyMr: tip.bodyMr,
        pictogramKey: tip.pictogramKey,
        audioKey: tip.audioKey,
        appliesToCategoryCode: tip.appliesToCategoryCode,
        sortOrder: tip.sortOrder,
      },
    });
  }

  // 6. 60-day Price History
  console.log('📈 Seeding 60-day price trends across districts...');
  const districts = [
    { city: 'Pune', district: 'Pune', state: 'MH' },
    { city: 'Nagpur', district: 'Nagpur', state: 'MH' },
    { city: 'Thane', district: 'Thane', state: 'MH' },
    { city: 'Nashik', district: 'Nashik', state: 'MH' },
  ];

  const rng = mulberry32(123456789);
  const now = new Date();

  // Clear previous sample price entries to ensure deterministic clean history
  await prisma.priceEntry.deleteMany({
    where: { isSampleData: true, source: 'SEED' },
  });

  const priceEntriesToCreate: any[] = [];

  for (const d of districts) {
    for (const cat of categoriesData) {
      const catId = categoryMap.get(cat.code)!;
      const baseRate = parseFloat(cat.baseRate);

      for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
        const recordDate = new Date(now);
        recordDate.setUTCDate(recordDate.getUTCDate() - dayOffset);
        recordDate.setUTCHours(10, 0, 0, 0);

        // Daily drift:
        // PCB in Pune drifts upward (+5% over 60 days)
        // CABLE in Nagpur drifts downward (-5% over 60 days)
        let driftFactor = 1.0;
        if (cat.code === 'PCB' && d.district === 'Pune') {
          driftFactor = 1.0 + (60 - dayOffset) * 0.0015; // upward drift
        } else if (cat.code === 'CABLE' && d.district === 'Nagpur') {
          driftFactor = 1.0 - (60 - dayOffset) * 0.0015; // downward drift
        }

        const noise = (rng() - 0.5) * 0.06; // +/- 3% random noise
        const dayPrice = baseRate * driftFactor * (1 + noise);
        const buyingPrice = dayPrice.toFixed(2);
        const marketMin = (dayPrice * 0.9).toFixed(2);
        const marketMax = (dayPrice * 1.15).toFixed(2);

        priceEntriesToCreate.push({
          categoryId: catId,
          city: d.city,
          district: d.district,
          state: d.state,
          recordedAt: recordDate,
          buyingPrice: new Prisma.Decimal(buyingPrice),
          unit: cat.unit,
          marketMin: new Prisma.Decimal(marketMin),
          marketMax: new Prisma.Decimal(marketMax),
          source: 'SEED',
          isSampleData: true,
        });
      }
    }
  }

  // Chunk inserts for performance
  const CHUNK_SIZE = 200;
  for (let i = 0; i < priceEntriesToCreate.length; i += CHUNK_SIZE) {
    const chunk = priceEntriesToCreate.slice(i, i + CHUNK_SIZE);
    await prisma.priceEntry.createMany({ data: chunk });
  }

  console.log(`✅ Database seeding completed successfully! Total price entries: ${priceEntriesToCreate.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
