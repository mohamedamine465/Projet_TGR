import { Router } from 'express';
import authRoutes from './modules/authentification/auth.routes.js';

const apiRouter = Router();

// ==========================================
// MONTAGE DES MODULES DE L'API
// ==========================================

// Le module d'authentification est greffé ici. 
// Son chemin final sera /api/auth puisque ce routeur est monté sur /api dans server.js
apiRouter.use('/auth', authRoutes);

// Vous ajouterez vos autres modules ici à l'avenir :
// apiRouter.use('/dette', detteRoutes);
// apiRouter.use('/projets', projetRoutes);

export default apiRouter;
