import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';
import * as OrdrePaiementService from './ordre-paiement.service.js';

export const getAll = async (req, res) => {

    /* #swagger.tags = ['Ordres de Paiement'] */
    const ordres = await OrdrePaiementService.getAllOrdresPaiement(req.query);
    
    const serialized = JSON.parse(JSON.stringify(ordres, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    
    sendSuccess(res, 200, "Liste des ordres de paiement récupérée avec succès", serialized);
};

export const getById = async (req, res) => {

    /* #swagger.tags = ['Ordres de Paiement'] */
    const ordre = await OrdrePaiementService.getOrdrePaiementById(req.params.numOrdre);
    if (!ordre) return sendError(res, 404, "Ordre de paiement non trouvé");
    
    const serialized = JSON.parse(JSON.stringify(ordre, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    
    sendSuccess(res, 200, "Ordre de paiement récupéré avec succès", serialized);
};

export const create = async (req, res) => {

    /* #swagger.tags = ['Ordres de Paiement'] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données de l\'ordre de paiement à créer',
            schema: { $ref: '#/definitions/OrdrePaiement' }
    } */
    const userId = req.user.idUtilisateur;
    const ordre = await OrdrePaiementService.createOrdrePaiement(req.body, userId);
    
    const serialized = JSON.parse(JSON.stringify(ordre, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    
    sendSuccess(res, 201, "Ordre de paiement créé avec succès", serialized);
};

export const update = async (req, res) => {

    /* #swagger.tags = ['Ordres de Paiement'] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données de l\'ordre de paiement à modifier',
            schema: { $ref: '#/definitions/OrdrePaiement' }
    } */
    const userId = req.user.idUtilisateur;
    const ordre = await OrdrePaiementService.updateOrdrePaiement(req.params.numOrdre, req.body, userId);
    
    const serialized = JSON.parse(JSON.stringify(ordre, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    
    sendSuccess(res, 200, "Ordre de paiement mis à jour avec succès", serialized);
};

export const remove = async (req, res) => {

    /* #swagger.tags = ['Ordres de Paiement'] */
    await OrdrePaiementService.deleteOrdrePaiement(req.params.numOrdre);
    sendSuccess(res, 200, "Ordre de paiement supprimé avec succès");
};

export const generateLettrePdf = async (req, res) => {
    try {
        /* #swagger.tags = ['Ordres de Paiement'] */
        const numlettre = parseInt(req.params.numlettre, 10);
        
        // Appeler le service pour récupérer le flux PDF
        const pdfDoc = await OrdrePaiementService.generatePdfStream(numlettre);
        
        // Le Contrôleur ne gère que les Headers HTTP et le renvoi (pipe)
        res.setHeader('Content-disposition', `attachment; filename=lettre_reglement_${numlettre}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        
        pdfDoc.pipe(res);
        
    } catch (error) {
        console.error("Erreur génération PDF:", error);
        if (error.message.includes("Aucun ordre")) {
            return res.status(404).send(error.message);
        }
        res.status(500).send("Erreur lors de la génération du PDF.");
    }
};
