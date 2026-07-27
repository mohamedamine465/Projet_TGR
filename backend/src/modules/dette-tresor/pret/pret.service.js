import { prisma } from '../../../config/db.js';

export const getAllPrets = async (filters = {}) => {
    const where = {};
    
    if (filters.numPret) {
        where.numPret = BigInt(filters.numPret);
    }
    
    if (filters.soldeCourant) {
        where.soldeCourant = BigInt(filters.soldeCourant);
    }

    if (filters.objet) {
        where.objet = {
            contains: filters.objet,
            mode: 'insensitive'
        };
    }
    
    if (filters.codeCategorie) {
        where.preteur = {
            codeCategorie: Number(filters.codeCategorie)
        };
    }

    if (filters.numEmprunt) {
        where.numEmprunt = {
            contains: filters.numEmprunt,
            mode: 'insensitive'
        };
    }

    if (filters.dateCreation) {
        const startOfDay = new Date(filters.dateCreation);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(filters.dateCreation);
        endOfDay.setHours(23, 59, 59, 999);
        
        where.dateCreation = {
            gte: startOfDay,
            lte: endOfDay
        };
    }

    return await prisma.pret.findMany({
        where,
        include: {
            preteur: true,
        },
        orderBy: {
            dateCreation: 'desc'
        }
    });
};

export const getAllPreteurs = async () => {
    return await prisma.preteur.findMany({
        include: {
            adresses: true
        }
    });
};

export const getPretById = async (numPret) => {
    return await prisma.pret.findUnique({
        where: { numPret: BigInt(numPret) },
        include: {
            preteur: true,
            echeanciers: {
                include: {
                    echeances: true
                }
            }
        }
    });
};

export const createPret = async (pretData, updatedById) => {
    const { numPret, dateCreation, objet, soldeCourant, numEmprunt, preteurId, echeanciers } = pretData;
    
    const dataToCreate = {
        numPret: BigInt(numPret),
        dateCreation: new Date(dateCreation),
        objet,
        soldeCourant: BigInt(soldeCourant),
        numEmprunt,
        preteurId: Number(preteurId),
        updatedById
    };

    if (echeanciers && echeanciers.length > 0) {
        dataToCreate.echeanciers = {
            create: echeanciers.map(e => ({
                tranche: e.tranche,
                echeances: {
                    create: e.echeances?.map(ech => ({
                        dateEcheance: new Date(ech.dateEcheance),
                        montantCapital: parseFloat(ech.montantCapital),
                        montantInteret: parseFloat(ech.montantInteret),
                        montantCommission: parseFloat(ech.montantCommission),
                        statut: ech.statut || 'En cours'
                    })) || []
                }
            }))
        };
    }

    return await prisma.pret.create({
        data: dataToCreate,
        include: {
            echeanciers: {
                include: { echeances: true }
            }
        }
    });
};

export const updatePret = async (numPret, pretData, updatedById) => {
    const { objet, soldeCourant, numEmprunt, preteurId } = pretData;
    
    const updateData = {
        updatedById
    };

    if (objet) updateData.objet = objet;
    if (soldeCourant !== undefined) updateData.soldeCourant = BigInt(soldeCourant);
    if (numEmprunt) updateData.numEmprunt = numEmprunt;
    if (preteurId) updateData.preteurId = Number(preteurId);

    return await prisma.pret.update({
        where: { numPret: BigInt(numPret) },
        data: updateData
    });
};

export const deletePret = async (numPret) => {
    const pretId = BigInt(numPret);
    
    // Pour pouvoir supprimer le prêt, on doit supprimer d'abord ses échéanciers
    const echeanciers = await prisma.echeancier.findMany({ where: { pretId } });
    const echeancierIds = echeanciers.map(e => e.codeEcheancier);
    
    if (echeancierIds.length > 0) {
        await prisma.echeance.deleteMany({
            where: { echeancierId: { in: echeancierIds } }
        });
        await prisma.echeancier.deleteMany({
            where: { pretId }
        });
    }

    return prisma.pret.delete({
        where: { numPret: pretId }
    });
};

export const createPreteur = async (data) => {
    const payload = {
        codeCategorie: Number(data.codeCategorie),
        maturite: data.maturite,
        designation: data.designation
    };

    if (data.adresse && data.adresse.trim() !== '') {
        payload.adresses = {
            create: {
                adresse: data.adresse
            }
        };
    }

    return prisma.preteur.create({
        data: payload,
        include: {
            adresses: true
        }
    });
};

export const updatePreteur = async (codeCategorie, data) => {
    const payload = {
        maturite: data.maturite,
        designation: data.designation
    };

    if (data.adresse !== undefined) {
        // Find existing addresses to update or create
        const existingPreteur = await prisma.preteur.findUnique({
            where: { codeCategorie: Number(codeCategorie) },
            include: { adresses: true }
        });

        if (existingPreteur.adresses.length > 0) {
            // Update the first address
            payload.adresses = {
                update: {
                    where: { idAdresse: existingPreteur.adresses[0].idAdresse },
                    data: { adresse: data.adresse }
                }
            };
        } else if (data.adresse.trim() !== '') {
            // Create new address
            payload.adresses = {
                create: { adresse: data.adresse }
            };
        }
    }

    return prisma.preteur.update({
        where: { codeCategorie: Number(codeCategorie) },
        data: payload,
        include: {
            adresses: true
        }
    });
};

export const deletePreteur = async (codeCategorie) => {
    // Supprimer d'abord les adresses associées pour éviter les conflits de clés étrangères
    await prisma.adresse.deleteMany({
        where: { preteurId: Number(codeCategorie) }
    });
    
    return prisma.preteur.delete({
        where: { codeCategorie: Number(codeCategorie) }
    });
};

export const createEcheancier = async (pretId, tranche) => {
    return prisma.echeancier.create({
        data: {
            pretId: BigInt(pretId),
            tranche: Number(tranche)
        }
    });
};

export const createEcheance = async (echeancierId, ech) => {
    return prisma.echeance.create({
        data: {
            echeancierId: Number(echeancierId),
            dateEcheance: new Date(ech.dateEcheance),
            montantCapital: parseFloat(ech.montantCapital),
            montantInteret: parseFloat(ech.montantInteret),
            montantCommission: parseFloat(ech.montantCommission),
            statut: ech.statut || 'Non Réglée'
        }
    });
};
