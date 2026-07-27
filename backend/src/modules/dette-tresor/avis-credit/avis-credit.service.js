import { prisma } from '../../../config/db.js';

export const getAllAvisCredits = async (filters = {}) => {
    const where = {
        avisCredit: {
            isNot: null
        }
    };
    
    // Add filters logic if necessary (e.g. by pretId)
    if (filters.pretId) {
        where.pretId = BigInt(filters.pretId);
    }

    return await prisma.recette.findMany({
        where,
        include: {
            avisCredit: true,
            pret: {
                include: { preteur: true }
            },
            createdBy: {
                select: { nom: true, prenom: true }
            }
        },
        orderBy: {
            datePEC: 'desc'
        }
    });
};

export const getAvisCreditById = async (codeRecette) => {
    return await prisma.recette.findUnique({
        where: { codeRecette: parseInt(codeRecette, 10) },
        include: {
            avisCredit: true,
            pret: {
                include: { preteur: true }
            },
            createdBy: {
                select: { nom: true, prenom: true }
            }
        }
    });
};

export const createAvisCredit = async (data, userId) => {
    const { datePEC, dateEcheance, pretId, montant, taux } = data;

    return await prisma.recette.create({
        data: {
            datePEC: new Date(datePEC),
            dateEcheance: new Date(dateEcheance),
            pretId: pretId ? BigInt(pretId) : null,
            createdById: userId,
            avisCredit: {
                create: {
                    montant: parseFloat(montant),
                    taux: parseInt(taux, 10)
                }
            }
        },
        include: {
            avisCredit: true,
            pret: true
        }
    });
};

export const updateAvisCredit = async (codeRecette, data, userId) => {
    const { datePEC, dateEcheance, pretId, montant, taux } = data;

    const updateData = {};
    if (datePEC) updateData.datePEC = new Date(datePEC);
    if (dateEcheance) updateData.dateEcheance = new Date(dateEcheance);
    if (pretId) updateData.pretId = BigInt(pretId);

    const avisCreditUpdate = {};
    if (montant !== undefined) avisCreditUpdate.montant = parseFloat(montant);
    if (taux !== undefined) avisCreditUpdate.taux = parseInt(taux, 10);

    if (Object.keys(avisCreditUpdate).length > 0) {
        updateData.avisCredit = {
            update: avisCreditUpdate
        };
    }

    return await prisma.recette.update({
        where: { codeRecette: parseInt(codeRecette, 10) },
        data: updateData,
        include: {
            avisCredit: true,
            pret: true
        }
    });
};

export const deleteAvisCredit = async (codeRecette) => {
    return await prisma.recette.delete({
        where: { codeRecette: parseInt(codeRecette, 10) }
    });
};
