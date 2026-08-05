import { Router } from 'express';
import authRoutes from './modules/authentification/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import pretRoutes from './modules/dette-tresor/pret/pret.routes.js';
import avisCreditRoutes from './modules/dette-tresor/avis-credit/avis-credit.routes.js';
import ordrePaiementRoutes from './modules/dette-tresor/ordre-paiement/ordre-paiement.routes.js';
import avisDebitRoutes from './modules/dette-tresor/avis-debit/avis-debit.routes.js';
import projetRoutes from './modules/programme-meda/projet/projet.routes.js';
import approvisionnementRoutes from './modules/programme-meda/approvisionnement/approvisionnement.routes.js';
import avisOperationRoutes from './modules/programme-meda/avis-operation/avis-operation.routes.js';

// Import Dette Intérieure
import adjudicationRoutes from './modules/dette-interieure/adjudication/adjudication.routes.js';
import bonEquipementRoutes from './modules/dette-interieure/bon-equipement/bon-equipement.routes.js';
import commissionRoutes from './modules/dette-interieure/commission/commission.routes.js';
import interetRoutes from './modules/dette-interieure/interet/interet.routes.js';

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
apiRouter.use('/dette-tresor/ordres-paiement', ordrePaiementRoutes);
apiRouter.use('/dette-tresor/avis-debits', avisDebitRoutes);

// Module Programme MEDA
apiRouter.use('/programme-meda/projets', projetRoutes);
apiRouter.use('/programme-meda/approvisionnements', approvisionnementRoutes);
apiRouter.use('/programme-meda/avis-operations', avisOperationRoutes);

// Module Dette Intérieure
apiRouter.use('/dette-interieure/adjudications', adjudicationRoutes);
apiRouter.use('/dette-interieure/bons-equipement', bonEquipementRoutes);
apiRouter.use('/dette-interieure/commissions', commissionRoutes);
apiRouter.use('/dette-interieure/interets', interetRoutes);

export default apiRouter;
