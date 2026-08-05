import { prisma } from '#config/db.js';
import { NotFoundError } from '#shared/utils/customErrors.js';

export const getAllAdjudications = async (filters = {}) => {
    return await prisma.adjudication.findMany({
        where: filters,
        include: {
            avisCreditAdj: true,
        },
        orderBy: { idAdjudication: 'desc' }
    });
};

export const getAdjudicationById = async (idAdjudication) => {
    const adjudication = await prisma.adjudication.findUnique({
        where: { idAdjudication: parseInt(idAdjudication, 10) },
        include: {
            avisCreditAdj: true,
        }
    });
    if (!adjudication) throw new NotFoundError("Adjudication non trouvée");
    return adjudication;
};

export const createAdjudication = async (data) => {
    return await prisma.adjudication.create({
        data: {
            dateJouissance: new Date(data.dateJouissance),
            maturite: data.maturite,
            taux: data.taux,
            montant: data.montant
        }
    });
};

export const updateAdjudication = async (idAdjudication, data) => {
    const exists = await prisma.adjudication.findUnique({ where: { idAdjudication: parseInt(idAdjudication, 10) } });
    if (!exists) throw new NotFoundError("Adjudication non trouvée");

    return await prisma.adjudication.update({
        where: { idAdjudication: parseInt(idAdjudication, 10) },
        data: {
            dateJouissance: data.dateJouissance ? new Date(data.dateJouissance) : undefined,
            maturite: data.maturite,
            taux: data.taux,
            montant: data.montant
        }
    });
};

export const deleteAdjudication = async (idAdjudication) => {
    const exists = await prisma.adjudication.findUnique({ where: { idAdjudication: parseInt(idAdjudication, 10) } });
    if (!exists) throw new NotFoundError("Adjudication non trouvée");

    return await prisma.adjudication.delete({
        where: { idAdjudication: parseInt(idAdjudication, 10) }
    });
};
