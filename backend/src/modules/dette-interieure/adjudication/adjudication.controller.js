import { sendSuccess } from '#shared/utils/responseHandler.js';
import * as AdjudicationService from './adjudication.service.js';

export const getAll = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Adjudications'] */
    const adjudications = await AdjudicationService.getAllAdjudications(req.query);
    sendSuccess(res, 200, "Liste des adjudications récupérée avec succès", adjudications);
};

export const getById = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Adjudications'] */
    const adjudication = await AdjudicationService.getAdjudicationById(req.params.id);
    sendSuccess(res, 200, "Adjudication récupérée avec succès", adjudication);
};

export const create = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Adjudications'] */
    const adjudication = await AdjudicationService.createAdjudication(req.body);
    sendSuccess(res, 201, "Adjudication créée avec succès", adjudication);
};

export const update = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Adjudications'] */
    const adjudication = await AdjudicationService.updateAdjudication(req.params.id, req.body);
    sendSuccess(res, 200, "Adjudication mise à jour avec succès", adjudication);
};

export const remove = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Adjudications'] */
    await AdjudicationService.deleteAdjudication(req.params.id);
    sendSuccess(res, 200, "Adjudication supprimée avec succès");
};
