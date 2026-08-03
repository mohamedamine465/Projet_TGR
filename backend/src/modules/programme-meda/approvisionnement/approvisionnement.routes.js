import express from 'express';
import * as approvisionnementController from './approvisionnement.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', authMiddleware, approvisionnementController.getAllApprovisionnements);
router.post('/', authMiddleware, approvisionnementController.createApprovisionnement);
router.put('/:id', authMiddleware, approvisionnementController.updateApprovisionnement);
router.delete('/:id', authMiddleware, approvisionnementController.deleteApprovisionnement);

export default router;
