import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, changePassword, refreshToken, logout } from './auth.controller.js';
import { authMiddleware, requireType, requireProfil } from '../../middleware/auth.middleware.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message: { message: 'Trop de tentatives de connexion, veuillez réessayer après 15 minutes.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// ==========================================
// ROUTES PUBLIQUES
// ==========================================
router.post('/login', loginLimiter, login);
router.post('/change-password', changePassword); // Utilisable sans token pour la première connexion (ou avec token)
router.post('/refresh-token', refreshToken);

// ==========================================
// ROUTES PROTÉGÉES
// ==========================================
router.post('/logout', authMiddleware, logout);

// ==========================================
// ROUTES PROTÉGÉES
// ==========================================

import { sendSuccess } from '../../shared/utils/responseHandler.js';

// Route de base nécessitant juste d'être connecté (et d'avoir passé le first_login)
router.get('/me', authMiddleware, (req, res) => {
  /*
    #swagger.tags = ['Authentification']
    #swagger.summary = 'Obtenir le profil de l\'utilisateur connecté'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
  sendSuccess(res, 200, "Profil récupéré avec succès", { user: req.user });
});

export default router;
