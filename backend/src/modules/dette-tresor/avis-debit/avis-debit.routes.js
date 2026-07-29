import { Router } from 'express';
import { getAll, getById, create, update, remove } from './avis-debit.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = Router();

// Protection par token JWT
router.use(authMiddleware);

router.get('/', getAll);
router.get('/:codeDepense', getById);
router.post('/', create);
router.put('/:codeDepense', update);
router.delete('/:codeDepense', remove);

export default router;
