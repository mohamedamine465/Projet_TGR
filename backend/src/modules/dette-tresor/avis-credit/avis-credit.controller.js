import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';
import * as AvisCreditService from './avis-credit.service.js';

export const getAll = async (req, res) => {

    /* #swagger.tags = ['Avis de Crédit'] */
    const avisCredits = await AvisCreditService.getAllAvisCredits(req.query);
    // Serialize BigInt to string to prevent JSON serialization errors
    const serialized = JSON.parse(JSON.stringify(avisCredits, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    sendSuccess(res, 200, "Liste des avis de crédits récupérée avec succès", serialized);
};

export const getById = async (req, res) => {

    /* #swagger.tags = ['Avis de Crédit'] */
    const avisCredit = await AvisCreditService.getAvisCreditById(req.params.codeRecette);
    if (!avisCredit) return sendError(res, 404, "Avis de crédit non trouvé");
    
    const serialized = JSON.parse(JSON.stringify(avisCredit, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    sendSuccess(res, 200, "Avis de crédit récupéré avec succès", serialized);
};

export const create = async (req, res) => {

    /* #swagger.tags = ['Avis de Crédit'] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données de l\'avis de crédit à créer',
            schema: { $ref: '#/definitions/AvisCredit' }
    } */
    const userId = req.user.idUtilisateur;
    const avisCredit = await AvisCreditService.createAvisCredit(req.body, userId);
    
    const serialized = JSON.parse(JSON.stringify(avisCredit, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    sendSuccess(res, 201, "Avis de crédit créé avec succès", serialized);
};

export const update = async (req, res) => {

    /* #swagger.tags = ['Avis de Crédit'] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données de l\'avis de crédit à modifier',
            schema: { $ref: '#/definitions/AvisCredit' }
    } */
    const userId = req.user.idUtilisateur;
    const avisCredit = await AvisCreditService.updateAvisCredit(req.params.codeRecette, req.body, userId);
    
    const serialized = JSON.parse(JSON.stringify(avisCredit, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    sendSuccess(res, 200, "Avis de crédit mis à jour avec succès", serialized);
};

export const remove = async (req, res) => {

    /* #swagger.tags = ['Avis de Crédit'] */
    await AvisCreditService.deleteAvisCredit(req.params.codeRecette);
    sendSuccess(res, 200, "Avis de crédit supprimé avec succès");
};
