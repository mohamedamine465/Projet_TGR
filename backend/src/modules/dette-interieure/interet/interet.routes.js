import { Router } from 'express';
import * as InteretController from './interet.controller.js';
import { authMiddleware, requireProfil } from '#middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(requireProfil('Dette Interieure'));

router.get('/', InteretController.getAll);
router.post('/', InteretController.create);
router.post('/:id/lignes', InteretController.addLigne);

export default router;
