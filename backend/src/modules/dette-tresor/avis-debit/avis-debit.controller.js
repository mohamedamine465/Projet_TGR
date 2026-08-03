import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';
import * as AvisDebitService from './avis-debit.service.js';

export const getAll = async (req, res) => {
    try {
        /* #swagger.tags = ['Avis de Débit'] */
        const avisDebits = await AvisDebitService.getAllAvisDebit(req.query);
        
        const serialized = JSON.parse(JSON.stringify(avisDebits, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        sendSuccess(res, 200, "Liste des avis de débits récupérée", serialized);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération des avis de débits", error.message);
    }
};

export const getById = async (req, res) => {
    try {
        /* #swagger.tags = ['Avis de Débit'] */
        const avisDebit = await AvisDebitService.getAvisDebitById(req.params.codeDepense);
        if (!avisDebit) return sendError(res, 404, "Avis de débit non trouvé");
        
        const serialized = JSON.parse(JSON.stringify(avisDebit, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        sendSuccess(res, 200, "Avis de débit récupéré", serialized);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération de l'avis de débit", error.message);
    }
};

export const create = async (req, res) => {
    try {
        /* #swagger.tags = ['Avis de Débit'] */
        /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Données de l\'avis de débit',
                schema: { $ref: '#/definitions/AvisDebit' }
        } */
        const userId = req.user.idUtilisateur;
        const avisDebit = await AvisDebitService.createAvisDebit(req.body, userId);
        
        const serialized = JSON.parse(JSON.stringify(avisDebit, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        sendSuccess(res, 201, "Avis de débit créé avec succès", serialized);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la création de l'avis de débit", error.message);
    }
};

export const update = async (req, res) => {
    try {
        /* #swagger.tags = ['Avis de Débit'] */
        /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Données de l\'avis de débit à modifier',
                schema: { $ref: '#/definitions/AvisDebit' }
        } */
        const userId = req.user.idUtilisateur;
        const avisDebit = await AvisDebitService.updateAvisDebit(req.params.codeDepense, req.body, userId);
        
        const serialized = JSON.parse(JSON.stringify(avisDebit, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        sendSuccess(res, 200, "Avis de débit mis à jour", serialized);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la mise à jour de l'avis de débit", error.message);
    }
};

export const remove = async (req, res) => {
    try {
        /* #swagger.tags = ['Avis de Débit'] */
        await AvisDebitService.deleteAvisDebit(req.params.codeDepense);
        sendSuccess(res, 200, "Avis de débit supprimé avec succès");
    } catch (error) {
        sendError(res, 400, "Erreur lors de la suppression de l'avis de débit", error.message);
    }
};
