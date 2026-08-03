import * as approvisionnementService from './approvisionnement.service.js';
import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';

export const getAllApprovisionnements = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    const appros = await approvisionnementService.getAllApprovisionnements(req.query);
    const serialized = JSON.parse(JSON.stringify(appros, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    sendSuccess(res, 200, "Liste des approvisionnements récupérée avec succès", serialized);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la récupération des approvisionnements", error.message);
  }
};

export const createApprovisionnement = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données de l\'approvisionnement à créer',
            schema: { $ref: '#/definitions/Approvisionnement' }
    } */
    const userId = req.user.idUtilisateur;
    const appro = await approvisionnementService.createApprovisionnement(req.body, userId);
    const serialized = JSON.parse(JSON.stringify(appro, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    sendSuccess(res, 201, "Approvisionnement créé avec succès", serialized);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la création de l'approvisionnement", error.message);
  }
};

export const updateApprovisionnement = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    const userId = req.user.idUtilisateur;
    const appro = await approvisionnementService.updateApprovisionnement(Number(req.params.id), req.body, userId);
    const serialized = JSON.parse(JSON.stringify(appro, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    sendSuccess(res, 200, "Approvisionnement mis à jour avec succès", serialized);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la mise à jour de l'approvisionnement", error.message);
  }
};

export const deleteApprovisionnement = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    await approvisionnementService.deleteApprovisionnement(Number(req.params.id));
    sendSuccess(res, 200, "Approvisionnement supprimé avec succès");
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la suppression de l'approvisionnement", error.message);
  }
};
