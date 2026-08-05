import { sendSuccess } from '#shared/utils/responseHandler.js';
import * as BonEquipementService from './bon-equipement.service.js';

export const getAll = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Bons d\'Equipement'] */
    const bons = await BonEquipementService.getAllBons(req.query);
    sendSuccess(res, 200, "Liste des bons d'équipement récupérée avec succès", bons);
};

export const getById = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Bons d\'Equipement'] */
    const bon = await BonEquipementService.getBonById(req.params.id);
    sendSuccess(res, 200, "Bon d'équipement récupéré avec succès", bon);
};

export const create = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Bons d\'Equipement'] */
    const bon = await BonEquipementService.createBon(req.body);
    sendSuccess(res, 201, "Bon d'équipement créé avec succès", bon);
};

export const linkSouscripteur = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Bons d\'Equipement'] */
    const { codeSouscripteur } = req.body;
    const lien = await BonEquipementService.linkSouscripteurToBon(req.params.id, codeSouscripteur);
    sendSuccess(res, 201, "Souscripteur lié au bon avec succès", lien);
};

export const remove = async (req, res) => {
    /* #swagger.tags = ['Dette Intérieure - Bons d\'Equipement'] */
    await BonEquipementService.deleteBon(req.params.id);
    sendSuccess(res, 200, "Bon d'équipement supprimé avec succès");
};
