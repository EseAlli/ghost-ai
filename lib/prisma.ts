import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from '@/prisma/generated/contract.d';
import contractJson from '@/prisma/generated/contract.json' with { type: 'json' };

const contract = contractFromJson<Contract>(contractJson);

const ACCELERATE_PREFIX = 'prisma+postgres://';

function createPrismaClient() {
  const url = process.env['DATABASE_URL'];

  if (url?.startsWith(ACCELERATE_PREFIX)) {
    // Prisma 8 has no Accelerate client; its runtime only accepts direct
    // postgres:// or postgresql:// URLs.
    throw new Error(
      'DATABASE_URL uses Prisma Accelerate (prisma+postgres://), which Prisma 8 does not support. Use the direct postgres:// connection string instead.',
    );
  }

  // Direct connection: the runtime builds a pg pool from the URL.
  return postgres({ contract, url });
}

type PrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
