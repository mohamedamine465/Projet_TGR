import express from 'express';
import * as avisOperationController from './avis-operation.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', authMiddleware, avisOperationController.getAllAvisOperations);
router.post('/', authMiddleware, avisOperationController.createAvisOperation);
router.put('/:id', authMiddleware, avisOperationController.updateAvisOperation);
router.delete('/:id', authMiddleware, avisOperationController.deleteAvisOperation);

export default router;
