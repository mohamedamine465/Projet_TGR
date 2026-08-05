import { Router } from 'express';
import * as BonEquipementController from './bon-equipement.controller.js';
import { authMiddleware, requireProfil } from '#middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(requireProfil('Dette Interieure'));

router.get('/', BonEquipementController.getAll);
router.get('/:id', BonEquipementController.getById);
router.post('/', BonEquipementController.create);
router.post('/:id/souscripteurs', BonEquipementController.linkSouscripteur);
router.delete('/:id', BonEquipementController.remove);

export default router;
