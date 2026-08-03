import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';
import * as PretService from './pret.service.js';
import { AppError } from '#shared/utils/customErrors.js';

export const getAll = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    const prets = await PretService.getAllPrets(req.query);
    sendSuccess(res, 200, "Liste des prêts récupérée avec succès", prets);
};

export const getPreteurs = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    const preteurs = await PretService.getAllPreteurs();
    sendSuccess(res, 200, "Liste des prêteurs récupérée avec succès", preteurs);
};

export const createPreteur = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    const preteur = await PretService.createPreteur(req.body);
    sendSuccess(res, 201, "Prêteur créé avec succès", preteur);
};

export const updatePreteur = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    const preteur = await PretService.updatePreteur(req.params.codeCategorie, req.body);
    sendSuccess(res, 200, "Prêteur mis à jour avec succès", preteur);
};

export const deletePreteur = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    await PretService.deletePreteur(req.params.codeCategorie);
    sendSuccess(res, 200, "Prêteur supprimé avec succès");
};

export const getById = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    /*
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
    const pret = await PretService.getPretById(req.params.numPret);
    if (!pret) throw new AppError("Prêt non trouvé", 404);
    sendSuccess(res, 200, "Prêt récupéré avec succès", pret);
};

export const create = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données du prêt à créer',
            schema: { $ref: '#/definitions/Pret' }
    } */
    const userId = req.user.idUtilisateur;
    const pret = await PretService.createPret(req.body, userId);
    sendSuccess(res, 201, "Prêt créé avec succès", pret);
};

export const update = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données du prêt à modifier',
            schema: { $ref: '#/definitions/Pret' }
    } */
    const userId = req.user.idUtilisateur;
    const pret = await PretService.updatePret(req.params.numPret, req.body, userId);
    sendSuccess(res, 200, "Prêt mis à jour avec succès", pret);
};

export const remove = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    await PretService.deletePret(req.params.numPret);
    sendSuccess(res, 200, "Prêt supprimé avec succès");
};

export const addEcheancier = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    const { pretId, tranche } = req.body;
    const echeancier = await PretService.createEcheancier(pretId, tranche);
    sendSuccess(res, 201, "Échéancier créé avec succès", echeancier);
};

export const addEcheance = async (req, res) => {
    /* #swagger.tags = ['Prêts'] */
    const { codeEcheancier } = req.params;
    const echeance = await PretService.createEcheance(codeEcheancier, req.body);
    sendSuccess(res, 201, "Échéance ajoutée avec succès", echeance);
};
