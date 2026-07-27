import { Router } from 'express';
import authRoutes from './modules/authentification/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import pretRoutes from './modules/dette-tresor/pret/pret.routes.js';
import avisCreditRoutes from './modules/dette-tresor/avis-credit/avis-credit.routes.js';

const apiRouter = Router();

// ==========================================
// MONTAGE DES MODULES DE L'API
// ==========================================

// Authentification
apiRouter.use('/auth', authRoutes);

// Administration (Gestion des utilisateurs)
apiRouter.use('/admin', adminRoutes);

// Module Dette du Trésor
apiRouter.use('/dette-tresor/prets', pretRoutes);
apiRouter.use('/dette-tresor/avis-credits', avisCreditRoutes);

export default apiRouter;
