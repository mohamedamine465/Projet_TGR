import * as avisOperationService from './avis-operation.service.js';
import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';

export const getAllAvisOperations = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    const avis = await avisOperationService.getAllAvisOperations(req.query);
    const serialized = JSON.parse(JSON.stringify(avis, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    sendSuccess(res, 200, "Liste des avis d'opérations récupérée avec succès", serialized);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la récupération des avis d'opérations", error.message);
  }
};

export const createAvisOperation = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données de l\'avis d\'opération à créer',
            schema: { $ref: '#/definitions/AvisOperation' }
    } */
    const userId = req.user.idUtilisateur;
    const avis = await avisOperationService.createAvisOperation(req.body, userId);
    const serialized = JSON.parse(JSON.stringify(avis, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    sendSuccess(res, 201, "Avis d'opération créé avec succès", serialized);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la création de l'avis d'opération", error.message);
  }
};

export const updateAvisOperation = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    const userId = req.user.idUtilisateur;
    const avis = await avisOperationService.updateAvisOperation(Number(req.params.id), req.body, userId);
    const serialized = JSON.parse(JSON.stringify(avis, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    sendSuccess(res, 200, "Avis d'opération mis à jour avec succès", serialized);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la mise à jour de l'avis d'opération", error.message);
  }
};

export const deleteAvisOperation = async (req, res) => {
  try {
    /* #swagger.tags = ['Programme MEDA'] */
    /* #swagger.security = [{ "bearerAuth": [] }] */
    await avisOperationService.deleteAvisOperation(Number(req.params.id));
    sendSuccess(res, 200, "Avis d'opération supprimé avec succès");
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Erreur lors de la suppression de l'avis d'opération", error.message);
  }
};
