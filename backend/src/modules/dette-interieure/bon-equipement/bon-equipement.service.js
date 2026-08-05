import { prisma } from '#config/db.js';
import { NotFoundError } from '#shared/utils/customErrors.js';

export const getAllBons = async (filters = {}) => {
    return await prisma.bonEquipement.findMany({
        where: filters,
        include: {
            avisCredits: true,
            avisRejets: true,
            souscripteurs: true
        },
        orderBy: { numBon: 'desc' }
    });
};

export const getBonById = async (numBon) => {
    const bon = await prisma.bonEquipement.findUnique({
        where: { numBon: parseInt(numBon, 10) },
        include: {
            avisCredits: true,
            avisRejets: true,
            souscripteurs: true
        }
    });
    if (!bon) throw new NotFoundError("Bon d'équipement non trouvé");
    return bon;
};

export const createBon = async (data) => {
    return await prisma.bonEquipement.create({
        data: {
            dateSouscription: new Date(data.dateSouscription),
            montant: data.montant,
            datePEC: new Date(data.datePEC)
        }
    });
};

export const linkSouscripteurToBon = async (numBon, codeSouscripteur) => {
    return await prisma.bonEquipementSouscripteur.create({
        data: {
            numBon: parseInt(numBon, 10),
            idSouscripteur: parseInt(codeSouscripteur, 10)
        }
    });
};

export const deleteBon = async (numBon) => {
    const exists = await prisma.bonEquipement.findUnique({ where: { numBon: parseInt(numBon, 10) } });
    if (!exists) throw new NotFoundError("Bon d'équipement non trouvé");

    return await prisma.bonEquipement.delete({
        where: { numBon: parseInt(numBon, 10) }
    });
};
