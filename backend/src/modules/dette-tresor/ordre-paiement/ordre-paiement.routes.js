import { Router } from 'express';
import { getAll, getById, create, update, remove, generateLettrePdf } from './ordre-paiement.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = Router();

// Routes protégées par authentification
router.use(authMiddleware);

router.get('/', getAll);
router.get('/lettre/:numlettre/pdf', generateLettrePdf);
router.get('/:numOrdre', getById);
router.post('/', create);
router.put('/:numOrdre', update);
router.delete('/:numOrdre', remove);

export default router;
