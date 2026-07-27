import { Router } from 'express';
import { getAll, getById, create, update, remove } from './avis-credit.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const router = Router();

// Routes protégées par authentification
router.use(authMiddleware);

router.get('/', getAll);
router.get('/:codeRecette', getById);
router.post('/', create);
router.put('/:codeRecette', update);
router.delete('/:codeRecette', remove);

export default router;