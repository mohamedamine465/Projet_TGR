import { Router } from 'express';
import authRoutes from './modules/authentification/auth.routes.js';
import pretRoutes from './modules/pret/pret.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const apiRouter = Router();

// ==========================================
// MONTAGE DES MODULES DE L'API
// ==========================================

// Authentification
apiRouter.use('/auth', authRoutes);

// Administration (Gestion des utilisateurs)
apiRouter.use('/admin', adminRoutes);

// Module Dette du Trésor
apiRouter.use('/dette/prets', pretRoutes);

export default apiRouter;
