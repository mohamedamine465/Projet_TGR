import * as projetService from './projet.service.js';
import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';

export const getAllProjets = async (req, res) => {

/* #swagger.tags = ['Programme MEDA'] */
/* #swagger.security = [{ "bearerAuth": [] }] */
const projets = await projetService.getAllProjets(req.query);
sendSuccess(res, 200, "Liste des projets récupérée avec succès", projets);
};

export const getProjetById = async (req, res) => {

/* #swagger.tags = ['Programme MEDA'] */
/* #swagger.security = [{ "bearerAuth": [] }] */
const projet = await projetService.getProjetById(Number(req.params.id));
if (!projet) return sendError(res, 404, "Projet non trouvé");
sendSuccess(res, 200, "Projet récupéré avec succès", projet);
};

export const createProjet = async (req, res) => {

/* #swagger.tags = ['Programme MEDA'] */
/* #swagger.security = [{ "bearerAuth": [] }] */
/*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Données du projet à créer (Don ou Fond de roulement)',
        schema: { $ref: '#/definitions/Projet' }
} */
const userId = req.user.idUtilisateur;
const projet = await projetService.createProjet(req.body, userId);
sendSuccess(res, 201, "Projet créé avec succès", projet);
};

export const updateProjet = async (req, res) => {

/* #swagger.tags = ['Programme MEDA'] */
/* #swagger.security = [{ "bearerAuth": [] }] */
const userId = req.user.idUtilisateur;
const projet = await projetService.updateProjet(Number(req.params.id), req.body, userId);
sendSuccess(res, 200, "Projet mis à jour avec succès", projet);
};

export const deleteProjet = async (req, res) => {

/* #swagger.tags = ['Programme MEDA'] */
/* #swagger.security = [{ "bearerAuth": [] }] */
await projetService.deleteProjet(Number(req.params.id));
sendSuccess(res, 200, "Projet supprimé avec succès");
};
