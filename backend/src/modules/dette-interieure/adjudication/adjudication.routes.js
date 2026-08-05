import { Router } from 'express';
import * as AdjudicationController from './adjudication.controller.js';
import { authMiddleware, requireProfil } from '#middleware/auth.middleware.js';

const router = Router();

// Toutes les routes nécessitent l'authentification et le profil "Dette Intérieure"
router.use(authMiddleware);
router.use(requireProfil('Dette Interieure'));

router.get('/', AdjudicationController.getAll);
router.get('/:id', AdjudicationController.getById);
router.post('/', AdjudicationController.create);
router.put('/:id', AdjudicationController.update);
router.delete('/:id', AdjudicationController.remove);

export default router;
