import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Un petit log pour confirmer la bonne initialisation
prisma.$connect()
  .then(() => console.log('✅ Connexion à PostgreSQL réussie via Prisma'))
  .catch((err) => console.error('❌ Échec de la connexion à PostgreSQL:', err));