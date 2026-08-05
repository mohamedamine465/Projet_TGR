import { prisma } from '#config/db.js';
import { NotFoundError } from '#shared/utils/customErrors.js';

export const getAllBordereaux = async (filters = {}) => {
    return await prisma.bordereauEmission.findMany({
        where: filters,
        include: {
            commissions: true
        }
    });
};

export const createBordereau = async (data) => {
    return await prisma.bordereauEmission.create({
        data: {
            numDecompte: data.numDecompte || 1,
            montantBordereau: data.montantBordereau || 0
        }
    });
};

export const getAllOPMaroclear = async () => {
    return await prisma.oPCommissionMaroclear.findMany({
        include: {
            ordrePaiement: true,
            operations: true,
            commissions: true
        }
    });
};

export const createOPMaroclear = async (data, userId) => {
    // Il faut d'abord créer l'OP générique, puis l'OP spécifique Maroclear
    const op = await prisma.ordrePaiement.create({
        data: {
            datePEC: new Date(data.datePEC || Date.now()),
            dateEcheance: new Date(data.dateEcheance || Date.now()),
            montantCapital: data.montantCapital || 0,
            montantInteret: data.montantInteret || 0,
            montantCommission: data.montantCommission || 0,
            numlettre: data.numlettre || 1,
            createdById: parseInt(userId, 10)
        }
    });

    return await prisma.oPCommissionMaroclear.create({
        data: {
            numOP: data.numOP || 1,
            numLettre: data.numLettre || 1,
            dateOP: new Date(data.dateOP || Date.now()),
            dateEmission: new Date(data.dateEmission || Date.now()),
            taux: data.taux || 0,
            ordrePaiementId: op.numOrdre
        },
        include: { ordrePaiement: true }
    });
};
