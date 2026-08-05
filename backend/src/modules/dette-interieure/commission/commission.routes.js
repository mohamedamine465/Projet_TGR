import { Router } from 'express';
import * as CommissionController from './commission.controller.js';
import { authMiddleware, requireProfil } from '#middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(requireProfil('Dette Interieure'));

router.get('/bordereaux', CommissionController.getBordereaux);
router.post('/bordereaux', CommissionController.createBordereau);

router.get('/op-maroclear', CommissionController.getOPMaroclear);
router.post('/op-maroclear', CommissionController.createOPMaroclear);

export default router;
