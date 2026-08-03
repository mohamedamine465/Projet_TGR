import { Router } from 'express';
import { getUsers, getMetadata, createUser, resetPassword } from './admin.controller.js';
import { authMiddleware, requireType } from '#middleware/auth.middleware.js';

const router = Router();

// Routes protégées par authentification et restreintes aux Administrateurs
router.use(authMiddleware);
router.use(requireType('Administrateur'));

router.get('/users', getUsers);
router.get('/metadata', getMetadata);
router.post('/users', createUser);
router.post('/users/:id/reset-password', resetPassword);

export default router;
