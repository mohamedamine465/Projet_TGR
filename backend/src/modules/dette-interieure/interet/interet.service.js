import { prisma } from '#config/db.js';
import { NotFoundError } from '#shared/utils/customErrors.js';

export const getAllInterets = async (filters = {}) => {
    return await prisma.interet.findMany({
        where: filters,
        include: {
            depense: true,
            lignes: true
        }
    });
};

export const createInteret = async (data, userId) => {
    // Créer la dépense générique puis l'intérêt spécifique
    return await prisma.$transaction(async (tx) => {
        const depense = await tx.depense.create({
            data: {
                createdById: parseInt(userId, 10),
                datePEC: new Date(),
                dateEcheance: new Date(),
                // numOp and anneeOp don't exist on Depense
            }
        });

        return await tx.interet.create({
            data: {
                depenseId: depense.codeDepense,
                annee: data.annee,
                trimestre: data.trimestre,
                tauxInteret: data.tauxInteret,
                nbreJour: data.nbreJour
            }
        });
    });
};

export const addLigneToInteret = async (idInteret, data) => {
    return await prisma.ligne.create({
        data: {
            idInteret: parseInt(idInteret, 10),
            mois: data.mois,
            soldeMin: data.soldeMin,
            soldeMax: data.soldeMax,
            soldeMoyen: data.soldeMoyen,
            interetBrut: data.interetBrut
        }
    });
};
