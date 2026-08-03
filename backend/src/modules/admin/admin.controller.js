import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';
import * as AdminService from './admin.service.js';

export const getUsers = async (req, res) => {

    const users = await AdminService.getAllUsers();
    sendSuccess(res, 200, "Liste des utilisateurs récupérée avec succès", users);
};

export const getMetadata = async (req, res) => {

    const data = await AdminService.getTypesAndProfils();
    sendSuccess(res, 200, "Types et profils récupérés avec succès", data);
};

export const createUser = async (req, res) => {

    const result = await AdminService.createUser(req.body, req.user);
    sendSuccess(res, 201, "Utilisateur créé avec succès", result);
};

export const resetPassword = async (req, res) => {

    const plainPassword = await AdminService.resetUserPassword(req.params.id);
    sendSuccess(res, 200, "Mot de passe réinitialisé avec succès", { plainPassword });
};
