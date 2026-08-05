import { sendSuccess } from '#shared/utils/responseHandler.js';
import * as InteretService from './interet.service.js';

export const getAll = async (req, res) => {
    const interets = await InteretService.getAllInterets(req.query);
    sendSuccess(res, 200, "Intérêts récupérés avec succès", interets);
};

export const create = async (req, res) => {
    const userId = req.user.idUtilisateur;
    const interet = await InteretService.createInteret(req.body, userId);
    sendSuccess(res, 201, "Intérêt calculé et créé avec succès", interet);
};

export const addLigne = async (req, res) => {
    const ligne = await InteretService.addLigneToInteret(req.params.id, req.body);
    sendSuccess(res, 201, "Ligne ajoutée avec succès", ligne);
};
