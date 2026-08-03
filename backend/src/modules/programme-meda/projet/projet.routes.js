import express from 'express';
import * as projetController from './projet.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', authMiddleware, projetController.getAllProjets);
router.get('/:id', authMiddleware, projetController.getProjetById);
router.post('/', authMiddleware, projetController.createProjet);
router.put('/:id', authMiddleware, projetController.updateProjet);
router.delete('/:id', authMiddleware, projetController.deleteProjet);

export default router;
