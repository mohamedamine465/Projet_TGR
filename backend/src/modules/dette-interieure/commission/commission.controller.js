import { sendSuccess } from '#shared/utils/responseHandler.js';
import * as CommissionService from './commission.service.js';

export const getBordereaux = async (req, res) => {
    const bordereaux = await CommissionService.getAllBordereaux(req.query);
    sendSuccess(res, 200, "Bordereaux récupérés avec succès", bordereaux);
};

export const createBordereau = async (req, res) => {
    const bordereau = await CommissionService.createBordereau(req.body);
    sendSuccess(res, 201, "Bordereau créé avec succès", bordereau);
};

export const getOPMaroclear = async (req, res) => {
    const ops = await CommissionService.getAllOPMaroclear();
    sendSuccess(res, 200, "OP Maroclear récupérés avec succès", ops);
};

export const createOPMaroclear = async (req, res) => {
    const userId = req.user.idUtilisateur;
    const op = await CommissionService.createOPMaroclear(req.body, userId);
    sendSuccess(res, 201, "OP Maroclear créé avec succès", op);
};
