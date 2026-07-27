import { prisma } from '#config/db.js';
import PDFDocument from 'pdfkit';

export const getAllOrdresPaiement = async (filters = {}) => {
    const where = {};
    if (filters.pretId) where.pretId = BigInt(filters.pretId);
    if (filters.numlettre) where.numlettre = parseInt(filters.numlettre, 10);
    if (filters.numOrdre) where.numOrdre = parseInt(filters.numOrdre, 10);
    if (filters.montantCapital) where.montantCapital = parseFloat(filters.montantCapital);
    if (filters.montantInteret) where.montantInteret = parseFloat(filters.montantInteret);
    if (filters.montantCommission) where.montantCommission = parseFloat(filters.montantCommission);
    if (filters.datePEC) {
        const start = new Date(filters.datePEC);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(filters.datePEC);
        end.setUTCHours(23, 59, 59, 999);
        where.datePEC = { gte: start, lte: end };
    }
    
    return await prisma.ordrePaiement.findMany({
        where,
        include: {
            pret: {
                include: { preteur: true }
            },
            echeance: true,
            createdBy: {
                select: { nom: true, prenom: true }
            }
        },
        orderBy: {
            datePEC: 'desc'
        }
    });
};

export const getOrdrePaiementById = async (numOrdre) => {
    return await prisma.ordrePaiement.findUnique({
        where: { numOrdre: parseInt(numOrdre, 10) },
        include: {
            pret: {
                include: { preteur: true }
            },
            echeance: true,
            createdBy: {
                select: { nom: true, prenom: true }
            }
        }
    });
};

export const createOrdrePaiement = async (data, userId) => {
    const { datePEC, dateEcheance, montantCapital, montantInteret, montantCommission, numlettre, pretId, echeanceId } = data;

    return await prisma.ordrePaiement.create({
        data: {
            datePEC: new Date(datePEC),
            dateEcheance: new Date(dateEcheance),
            montantCapital: parseFloat(montantCapital || 0),
            montantInteret: parseFloat(montantInteret || 0),
            montantCommission: parseFloat(montantCommission || 0),
            numlettre: parseInt(numlettre, 10),
            pretId: pretId ? BigInt(pretId) : null,
            echeanceId: echeanceId ? parseInt(echeanceId, 10) : null,
            createdById: userId
        },
        include: {
            pret: true
        }
    });
};

export const updateOrdrePaiement = async (numOrdre, data, userId) => {
    const { datePEC, dateEcheance, montantCapital, montantInteret, montantCommission, numlettre, pretId, echeanceId } = data;

    return await prisma.ordrePaiement.update({
        where: { numOrdre: parseInt(numOrdre, 10) },
        data: {
            datePEC: datePEC ? new Date(datePEC) : undefined,
            dateEcheance: dateEcheance ? new Date(dateEcheance) : undefined,
            montantCapital: montantCapital !== undefined ? parseFloat(montantCapital) : undefined,
            montantInteret: montantInteret !== undefined ? parseFloat(montantInteret) : undefined,
            montantCommission: montantCommission !== undefined ? parseFloat(montantCommission) : undefined,
            numlettre: numlettre !== undefined ? parseInt(numlettre, 10) : undefined,
            pretId: pretId ? BigInt(pretId) : undefined,
            echeanceId: echeanceId ? parseInt(echeanceId, 10) : undefined,
            createdById: userId
        },
        include: {
            pret: true
        }
    });
};

export const deleteOrdrePaiement = async (numOrdre) => {
    return await prisma.ordrePaiement.delete({
        where: { numOrdre: parseInt(numOrdre, 10) }
    });
};

export const generatePdfStream = async (numlettre) => {
    const ordres = await getAllOrdresPaiement({ numlettre });
    
    if (!ordres || ordres.length === 0) {
        throw new Error("Aucun ordre de paiement trouvé pour cette lettre.");
    }
    
    const doc = new PDFDocument({ margin: 50 });
    
    // En-tête
    doc.fontSize(20).text(`Lettre de Règlement N° ${numlettre}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date de génération : ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);
    
    doc.fontSize(14).text("À l'attention de la BAM (Bank Al-Maghrib)", { underline: true });
    doc.moveDown();
    
    doc.fontSize(12).text("Nous vous prions de bien vouloir procéder au règlement des ordres de paiement suivants :");
    doc.moveDown();
    
    let totalCapital = 0;
    let totalInteret = 0;
    let totalCommission = 0;
    
    ordres.forEach((ordre) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`Ordre de paiement N° ${ordre.numOrdre}`);
        doc.font('Helvetica').fontSize(10);
        doc.text(`- Prêt N° : ${ordre.pretId || 'N/A'}`);
        doc.text(`- Capital : ${ordre.montantCapital} MAD`);
        doc.text(`- Intérêts : ${ordre.montantInteret} MAD`);
        doc.text(`- Commissions : ${ordre.montantCommission} MAD`);
        if (ordre.datePEC) {
            doc.text(`- Date PEC : ${new Date(ordre.datePEC).toLocaleDateString('fr-FR')}`);
        }
        doc.moveDown();
        
        totalCapital += Number(ordre.montantCapital) || 0;
        totalInteret += Number(ordre.montantInteret) || 0;
        totalCommission += Number(ordre.montantCommission) || 0;
    });
    
    doc.moveDown();
    doc.fontSize(14).font('Helvetica-Bold').text("Récapitulatif des montants :", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Total Capital : ${totalCapital.toFixed(2)} MAD`);
    doc.text(`Total Intérêts : ${totalInteret.toFixed(2)} MAD`);
    doc.text(`Total Commissions : ${totalCommission.toFixed(2)} MAD`);
    doc.moveDown();
    
    const totalGlobal = totalCapital + totalInteret + totalCommission;
    doc.fontSize(14).font('Helvetica-Bold').text(`MONTANT GLOBAL À RÉGLER : ${totalGlobal.toFixed(2)} MAD`);
    
    doc.moveDown(4);
    doc.fontSize(12).text("Signature autorisée", { align: 'right' });
    
    doc.end();
    
    return doc;
};
