import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllAvisOperations = async (filters = {}) => {
  const where = {};
  if (filters.projetId) where.projetId = Number(filters.projetId);
  if (filters.datePEC) {
    const date = new Date(filters.datePEC);
    where.datePEC = {
      gte: new Date(date.setHours(0, 0, 0, 0)),
      lt: new Date(date.setHours(23, 59, 59, 999))
    };
  }

  return await prisma.depense.findMany({
    where: {
      ...where,
      avisOperation: { isNot: null }
    },
    include: {
      avisOperation: true,
      projet: {
        include: {
          don: true,
          fondRoulement: true
        }
      }
    },
    orderBy: { datePEC: 'desc' }
  });
};

export const createAvisOperation = async (data, userId) => {
  const { projetId, datePEC, dateEcheance, numFacture, montantDispo, partFinancee } = data;

  return await prisma.depense.create({
    data: {
      datePEC: new Date(datePEC),
      dateEcheance: new Date(dateEcheance),
      projetId: Number(projetId),
      createdById: userId,
      avisOperation: {
        create: {
          numFacture: Number(numFacture),
          montantDispo: Number(montantDispo),
          partFinancee: Number(partFinancee)
        }
      }
    },
    include: { avisOperation: true, projet: true }
  });
};

export const updateAvisOperation = async (id, data, userId) => {
  const { datePEC, dateEcheance, numFacture, montantDispo, partFinancee, projetId } = data;

  return await prisma.depense.update({
    where: { codeDepense: Number(id) },
    data: {
      datePEC: new Date(datePEC),
      dateEcheance: new Date(dateEcheance),
      projetId: Number(projetId),
      avisOperation: {
        update: {
          numFacture: Number(numFacture),
          montantDispo: Number(montantDispo),
          partFinancee: Number(partFinancee)
        }
      }
    },
    include: { avisOperation: true, projet: true }
  });
};

export const deleteAvisOperation = async (id) => {
  return await prisma.depense.delete({
    where: { codeDepense: Number(id) }
  });
};
