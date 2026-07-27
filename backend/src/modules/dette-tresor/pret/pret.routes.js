import { Router } from 'express';
import { getAll, getPreteurs, createPreteur, updatePreteur, deletePreteur, getById, create, update, remove, addEcheancier, addEcheance } from './pret.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const router = Router();

// Routes protégées par authentification
router.use(authMiddleware);

// Bailleurs de fonds (Prêteurs)
router.get('/preteurs', getPreteurs);
router.post('/preteurs', createPreteur);
router.put('/preteurs/:codeCategorie', updatePreteur);
router.delete('/preteurs/:codeCategorie', deletePreteur);
router.post('/echeanciers', addEcheancier);
router.post('/echeanciers/:codeEcheancier/lignes', addEcheance);
router.get('/', getAll);
router.get('/:numPret', getById);
router.post('/', create);
router.put('/:numPret', update);
router.delete('/:numPret', remove);

export default router;
