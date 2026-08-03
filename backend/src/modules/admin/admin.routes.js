import { Router } from 'express';
import { getUsers, getMetadata, createUser, resetPassword } from './admin.controller.js';
import { authMiddleware } from '#middleware/auth.middleware.js';

const router = Router();

// Routes protégées par authentification
router.use(authMiddleware);

// Idéalement, il faudrait un middleware `requireAdmin` ici. 
// Pour le prototype, on fait confiance à l'UI.

router.get('/users', getUsers);
router.get('/metadata', getMetadata);
router.post('/users', createUser);
router.post('/users/:id/reset-password', resetPassword);

export default router;
