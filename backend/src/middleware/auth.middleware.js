import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { sendError } from '../shared/utils/responseHandler.js';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}/**
 * Middleware d'authentification principal.
 * Vérifie la validité du JWT et injecte l'utilisateur complet (avec Type et Profils) dans req.user.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Accès refusé. Token manquant ou format invalide.');
    }

    const token = authHeader.split(' ')[1];
    
    // Vérification du token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Récupération de l'utilisateur avec ses relations pour avoir les droits à jour
    const user = await prisma.utilisateur.findUnique({
      where: { idUtilisateur: decoded.userId },
      include: {
        typeUtilisateur: true,
        profils: true
      }
    });

    if (!user) {
      return sendError(res, 401, 'Utilisateur non trouvé ou compte supprimé.');
    }

    // Sécurité: Bloquer si l'utilisateur n'a jamais changé son mot de passe initial
    if (!user.dateDernierAcces) {
      return sendError(res, 403, 'Accès bloqué. Vous devez obligatoirement modifier votre mot de passe temporaire.', { first_login: true });
    }

    // Injection dans l'objet request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expiré. Veuillez vous reconnecter.');
    }
    return sendError(res, 401, 'Token invalide.', { error: error.message });
  }
};

/**
 * Middleware de vérification du type d'utilisateur (Rôle fonctionnel global).
 * @param {string} libelleType - Le type requis (ex: "Agent de Saisie", "Administrateur")
 */
export const requireType = (libelleType) => {
  return (req, res, next) => {
    if (!req.user || !req.user.typeUtilisateur) {
      return sendError(res, 403, 'Accès interdit. Informations de type manquantes.');
    }

    if (req.user.typeUtilisateur.libelleType !== libelleType) {
      return sendError(res, 403, `Accès interdit. Requis: [${libelleType}], Actuel: [${req.user.typeUtilisateur.libelleType}]`);
    }

    next();
  };
};

/**
 * Middleware de vérification du profil métier de l'utilisateur.
 * L'utilisateur peut cumuler plusieurs profils, on vérifie s'il possède le profil demandé.
 * @param {string} libelleProfil - Le profil requis (ex: "Dette du Tresor", "Dette Interieure", "Projets")
 */
export const requireProfil = (libelleProfil) => {
  return (req, res, next) => {
    if (!req.user || !req.user.profils) {
      return sendError(res, 403, 'Accès interdit. Informations de profils manquantes.');
    }

    const hasProfil = req.user.profils.some(p => p.libelleProfil === libelleProfil);
    if (!hasProfil) {
      return sendError(res, 403, `Accès interdit. Le profil métier '${libelleProfil}' est requis pour cette opération.`);
    }

    next();
  };
};
