import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllApprovisionnements = async (filters = {}) => {
  const where = {};
  if (filters.projetId) where.projetId = Number(filters.projetId);
  if (filters.datePEC) {
    const date = new Date(filters.datePEC);
    where.datePEC = {
      gte: new Date(date.setHours(0, 0, 0, 0)),
      lt: new Date(date.setHours(23, 59, 59, 999))
    };
  }

  return await prisma.recette.findMany({
    where: {
      ...where,
      approvisionnement: { isNot: null }
    },
    include: {
      approvisionnement: true,
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

export const createApprovisionnement = async (data, userId) => {
  const { projetId, datePEC, dateEcheance, cumulApprovis, montantApprovis, reference, numAvance } = data;

  return await prisma.recette.create({
    data: {
      datePEC: new Date(datePEC),
      dateEcheance: new Date(dateEcheance),
      projetId: Number(projetId),
      createdById: userId,
      approvisionnement: {
        create: {
          cumulApprovis: Number(cumulApprovis),
          montantApprovis: Number(montantApprovis),
          reference: reference,
          numAvance: Number(numAvance)
        }
      }
    },
    include: { approvisionnement: true, projet: true }
  });
};

export const updateApprovisionnement = async (id, data, userId) => {
  const { datePEC, dateEcheance, cumulApprovis, montantApprovis, reference, numAvance, projetId } = data;

  return await prisma.recette.update({
    where: { codeRecette: Number(id) },
    data: {
      datePEC: new Date(datePEC),
      dateEcheance: new Date(dateEcheance),
      projetId: Number(projetId),
      approvisionnement: {
        update: {
          cumulApprovis: Number(cumulApprovis),
          montantApprovis: Number(montantApprovis),
          reference: reference,
          numAvance: Number(numAvance)
        }
      }
    },
    include: { approvisionnement: true, projet: true }
  });
};

export const deleteApprovisionnement = async (id) => {
  return await prisma.recette.delete({
    where: { codeRecette: Number(id) }
  });
};
