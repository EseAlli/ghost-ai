import { config } from 'dotenv';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

// Next.js keeps secrets in .env.local; fall back to .env for other setups.
config({ path: ['.env.local', '.env'], quiet: true });

export default definePrismaConfig({
  orm: ormConfig({
    contract: './prisma/models/project.prisma',
    output: './prisma/generated',
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
