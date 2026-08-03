import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllProjets = async (filters = {}) => {
  const where = {};
  if (filters.idProjet) where.idProjet = Number(filters.idProjet);
  if (filters.gestion) where.gestion = Number(filters.gestion);
  if (filters.datePEC) {
    const date = new Date(filters.datePEC);
    where.datePEC = {
      gte: new Date(date.setHours(0, 0, 0, 0)),
      lt: new Date(date.setHours(23, 59, 59, 999))
    };
  }

  return await prisma.projet.findMany({
    where,
    include: {
      don: true,
      fondRoulement: {
        include: { preteur: true }
      },
      superviseur: {
        select: { nom: true, prenom: true }
      }
    },
    orderBy: { datePEC: 'desc' }
  });
};

export const getProjetById = async (id) => {
  return await prisma.projet.findUnique({
    where: { idProjet: id },
    include: {
      don: true,
      fondRoulement: true,
      approvisionnements: { include: { approvisionnement: true } },
      avisOperations: { include: { avisOperation: true } }
    }
  });
};

export const createProjet = async (data, userId) => {
  const { gestion, datePEC, type, numDon, objetDon, numContrat, preteurId } = data;

  const projetData = {
    gestion: Number(gestion),
    datePEC: new Date(datePEC),
    superviseurId: userId
  };

  if (type === 'DON') {
    projetData.don = {
      create: {
        numDon: Number(numDon),
        objet: objetDon
      }
    };
  } else if (type === 'FOND_ROULEMENT') {
    projetData.fondRoulement = {
      create: {
        numContrat: Number(numContrat),
        preteurId: String(preteurId)
      }
    };
  } else {
    throw new Error("Le type du projet doit être 'DON' ou 'FOND_ROULEMENT'");
  }

  return await prisma.projet.create({
    data: projetData,
    include: { don: true, fondRoulement: true }
  });
};

export const updateProjet = async (id, data, userId) => {
  const { gestion, datePEC, type, numDon, objetDon, numContrat, preteurId } = data;

  const projetData = {
    gestion: Number(gestion),
    datePEC: new Date(datePEC),
    superviseurId: userId
  };

  const currentProjet = await prisma.projet.findUnique({ where: { idProjet: id }, include: { don: true, fondRoulement: true } });
  if (!currentProjet) throw new Error("Projet introuvable");

  if (type === 'DON') {
    projetData.don = {
      upsert: {
        create: { numDon: Number(numDon), objet: objetDon },
        update: { numDon: Number(numDon), objet: objetDon }
      }
    };
    if (currentProjet.fondRoulement) {
      await prisma.fondRoulement.delete({ where: { projetId: id } });
    }
  } else if (type === 'FOND_ROULEMENT') {
    projetData.fondRoulement = {
      upsert: {
        create: { numContrat: Number(numContrat), preteurId: String(preteurId) },
        update: { numContrat: Number(numContrat), preteurId: String(preteurId) }
      }
    };
    if (currentProjet.don) {
      await prisma.don.delete({ where: { projetId: id } });
    }
  }

  return await prisma.projet.update({
    where: { idProjet: id },
    data: projetData,
    include: { don: true, fondRoulement: true }
  });
};

export const deleteProjet = async (id) => {
  return await prisma.projet.delete({
    where: { idProjet: id }
  });
};
