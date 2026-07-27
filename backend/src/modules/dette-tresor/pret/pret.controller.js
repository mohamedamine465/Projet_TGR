import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';
import * as PretService from './pret.service.js';

export const getAll = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        const prets = await PretService.getAllPrets(req.query);
        sendSuccess(res, 200, "Liste des prêts récupérée avec succès", prets);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération des prêts", error.message);
    }
};

export const getPreteurs = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        const preteurs = await PretService.getAllPreteurs();
        sendSuccess(res, 200, "Liste des prêteurs récupérée avec succès", preteurs);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération des prêteurs", error.message);
    }
};

export const createPreteur = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        const preteur = await PretService.createPreteur(req.body);
        sendSuccess(res, 201, "Prêteur créé avec succès", preteur);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la création du prêteur", error.message);
    }
};

export const updatePreteur = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        const preteur = await PretService.updatePreteur(req.params.codeCategorie, req.body);
        sendSuccess(res, 200, "Prêteur mis à jour avec succès", preteur);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la mise à jour du prêteur", error.message);
    }
};

export const deletePreteur = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        await PretService.deletePreteur(req.params.codeCategorie);
        sendSuccess(res, 200, "Prêteur supprimé avec succès");
    } catch (error) {
        sendError(res, 400, "Erreur lors de la suppression du prêteur (des prêts y sont peut-être liés)", error.message);
    }
};

export const getById = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        /*
          #swagger.security = [{
            "bearerAuth": []
          }]
        */
        const pret = await PretService.getPretById(req.params.numPret);
        if (!pret) return sendError(res, 404, "Prêt non trouvé");
        sendSuccess(res, 200, "Prêt récupéré avec succès", pret);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération du prêt", error.message);
    }
};

export const create = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Données du prêt à créer',
                schema: { $ref: '#/definitions/Pret' }
        } */
        const userId = req.user.idUtilisateur;
        const pret = await PretService.createPret(req.body, userId);
        sendSuccess(res, 201, "Prêt créé avec succès", pret);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la création du prêt", error.message);
    }
};

export const update = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Données du prêt à modifier',
                schema: { $ref: '#/definitions/Pret' }
        } */
        const userId = req.user.idUtilisateur;
        const pret = await PretService.updatePret(req.params.numPret, req.body, userId);
        sendSuccess(res, 200, "Prêt mis à jour avec succès", pret);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la mise à jour du prêt", error.message);
    }
};

export const remove = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        await PretService.deletePret(req.params.numPret);
        sendSuccess(res, 200, "Prêt supprimé avec succès");
    } catch (error) {
        sendError(res, 400, "Erreur lors de la suppression du prêt", error.message);
    }
};

export const addEcheancier = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        const { pretId, tranche } = req.body;
        const echeancier = await PretService.createEcheancier(pretId, tranche);
        sendSuccess(res, 201, "Échéancier créé avec succès", echeancier);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la création de l'échéancier", error.message);
    }
};

export const addEcheance = async (req, res) => {
    try {
        /* #swagger.tags = ['Prêts'] */
        const { codeEcheancier } = req.params;
        const echeance = await PretService.createEcheance(codeEcheancier, req.body);
        sendSuccess(res, 201, "Échéance ajoutée avec succès", echeance);
    } catch (error) {
        sendError(res, 400, "Erreur lors de l'ajout de l'échéance", error.message);
    }
};
