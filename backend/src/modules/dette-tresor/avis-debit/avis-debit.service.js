import { prisma } from '#config/db.js';

export const getAllAvisDebit = async (filters = {}) => {
    const where = { avisDebit: { isNot: null } };

    if (filters.pretId) where.pretId = BigInt(filters.pretId);
    if (filters.datePEC) {
        const startOfDay = new Date(filters.datePEC);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.datePEC);
        endOfDay.setUTCHours(23, 59, 59, 999);
        where.datePEC = { gte: startOfDay, lte: endOfDay };
    }
    
    // Filtres sur les propriétés de l'Avis de Débit
    const avisDebitFilters = {};
    let hasAvisDebitFilters = false;
    
    if (filters.type) {
        avisDebitFilters.type = filters.type;
        hasAvisDebitFilters = true;
    }
    if (filters.montantCapital) {
        avisDebitFilters.montantCapital = parseFloat(filters.montantCapital);
        hasAvisDebitFilters = true;
    }
    if (filters.montantInteret) {
        avisDebitFilters.montantInteret = parseFloat(filters.montantInteret);
        hasAvisDebitFilters = true;
    }
    
    if (hasAvisDebitFilters) {
        where.avisDebit = { ...where.avisDebit, ...avisDebitFilters };
    }

    return await prisma.depense.findMany({
        where,
        include: {
            avisDebit: true,
            pret: true,
            createdBy: {
                select: { nom: true, prenom: true }
            }
        },
        orderBy: { datePEC: 'desc' }
    });
};

export const getAvisDebitById = async (codeDepense) => {
    return await prisma.depense.findUnique({
        where: { codeDepense: parseInt(codeDepense, 10) },
        include: {
            avisDebit: true,
            pret: true,
            createdBy: {
                select: { nom: true, prenom: true }
            }
        }
    });
};

export const createAvisDebit = async (data, userId) => {
    return await prisma.depense.create({
        data: {
            datePEC: new Date(data.datePEC),
            dateEcheance: new Date(data.dateEcheance),
            pretId: data.pretId ? BigInt(data.pretId) : null,
            ordrePaiementId: data.ordrePaiementId ? parseInt(data.ordrePaiementId, 10) : null,
            createdById: userId,
            avisDebit: {
                create: {
                    dateDepense: new Date(data.dateDepense),
                    taux: parseFloat(data.taux),
                    montantCapital: parseFloat(data.montantCapital),
                    montantInteret: parseFloat(data.montantInteret),
                    montantCommission: parseFloat(data.montantCommission),
                    type: data.type
                }
            }
        },
        include: {
            avisDebit: true,
            pret: true
        }
    });
};

export const updateAvisDebit = async (codeDepense, data, userId) => {
    return await prisma.depense.update({
        where: { codeDepense: parseInt(codeDepense, 10) },
        data: {
            datePEC: data.datePEC ? new Date(data.datePEC) : undefined,
            dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : undefined,
            pretId: data.pretId ? BigInt(data.pretId) : undefined,
            ordrePaiementId: data.ordrePaiementId !== undefined ? (data.ordrePaiementId ? parseInt(data.ordrePaiementId, 10) : null) : undefined,
            avisDebit: {
                update: {
                    dateDepense: data.dateDepense ? new Date(data.dateDepense) : undefined,
                    taux: data.taux !== undefined ? parseFloat(data.taux) : undefined,
                    montantCapital: data.montantCapital !== undefined ? parseFloat(data.montantCapital) : undefined,
                    montantInteret: data.montantInteret !== undefined ? parseFloat(data.montantInteret) : undefined,
                    montantCommission: data.montantCommission !== undefined ? parseFloat(data.montantCommission) : undefined,
                    type: data.type
                }
            }
        },
        include: {
            avisDebit: true,
            pret: true
        }
    });
};

export const deleteAvisDebit = async (codeDepense) => {
    // La suppression de la Depense entraîne la suppression de l'AvisDebit en cascade
    return await prisma.depense.delete({
        where: { codeDepense: parseInt(codeDepense, 10) }
    });
};
