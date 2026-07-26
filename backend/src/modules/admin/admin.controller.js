import { sendSuccess, sendError } from '../../shared/utils/responseHandler.js';
import * as AdminService from './admin.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await AdminService.getAllUsers();
        sendSuccess(res, 200, "Liste des utilisateurs récupérée avec succès", users);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération des utilisateurs", error.message);
    }
};

export const getMetadata = async (req, res) => {
    try {
        const data = await AdminService.getTypesAndProfils();
        sendSuccess(res, 200, "Types et profils récupérés avec succès", data);
    } catch (error) {
        sendError(res, 500, "Erreur lors de la récupération des métadonnées", error.message);
    }
};

export const createUser = async (req, res) => {
    try {
        const result = await AdminService.createUser(req.body);
        sendSuccess(res, 201, "Utilisateur créé avec succès", result);
    } catch (error) {
        sendError(res, 400, "Erreur lors de la création de l'utilisateur", error.message);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const plainPassword = await AdminService.resetUserPassword(req.params.id);
        sendSuccess(res, 200, "Mot de passe réinitialisé avec succès", { plainPassword });
    } catch (error) {
        sendError(res, 400, "Erreur lors de la réinitialisation", error.message);
    }
};
