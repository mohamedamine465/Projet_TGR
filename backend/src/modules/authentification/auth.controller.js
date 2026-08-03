import { loginService, changePasswordService, refreshTokenService, logoutService } from './auth.service.js';
import { sendSuccess, sendError } from '#shared/utils/responseHandler.js';

/**
 * Contrôleur pour la connexion
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  /*
    #swagger.tags = ['Authentification']
    #swagger.summary = 'Connexion utilisateur'
    #swagger.description = 'Authentifie un utilisateur et renvoie un JWT. Gère aussi le cas de la première connexion (mot de passe provisoire).'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Email et mot de passe',
      required: true,
      schema: {
        $email: 'test@tgr.gov.ma',
        $password: 'MotDePasseSecret'
      }
    }
    #swagger.responses[200] = {
      description: 'Connexion réussie. Retourne le JWT et les informations utilisateur.',
      schema: {
        $first_login: false,
        $token: 'eyJhbGciOiJIUzI1NiIsInR5...',
        $user: {
          $idUtilisateur: 1,
          $nom: 'Doe',
          $prenom: 'John',
          $email: 'test@tgr.gov.ma',
          $typeUtilisateur: { $idType: 1, $libelleType: 'Valideur / Administrateur' },
          $profils: [{ $idProfil: 1, $libelleProfil: 'Dette du Tresor' }]
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Première connexion, changement de mot de passe obligatoire.',
      schema: {
        $first_login: true,
        $message: 'Première connexion détectée...',
        $email: 'test@tgr.gov.ma'
      }
    }
    #swagger.responses[400] = { description: 'Paramètres manquants.' }
    #swagger.responses[401] = { description: 'Identifiants incorrects.' }
  */
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return sendError(res, 400, 'Email et mot de passe sont requis.');
    }

    const result = await loginService(email, password);

    // Cas spécifique TGR : l'utilisateur doit changer son mdp
    if (result.first_login) {
      return sendError(res, 403, result.message, { first_login: result.first_login, email: result.email }); 
    }

    const { refreshToken, ...responseResult } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    return sendSuccess(res, 200, 'Connexion réussie', responseResult);
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};

/**
 * Contrôleur pour le changement de mot de passe
 * POST /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  /*
    #swagger.tags = ['Authentification']
    #swagger.summary = 'Changer le mot de passe'
    #swagger.description = 'Permet de changer le mot de passe. Obligatoire après une première connexion. Peut être appelé avec ou sans JWT. Si appelé sans JWT (première connexion), email est requis.'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Email (si non authentifié), mot de passe actuel et nouveau mot de passe',
      required: true,
      schema: {
        email: 'test@tgr.gov.ma',
        $currentPassword: 'ancienMotDePasse',
        $newPassword: 'NouveauMotDePasse8!'
      }
    }
    #swagger.responses[200] = { description: 'Mot de passe modifié avec succès.' }
    #swagger.responses[400] = { description: 'Erreur de validation des champs ou mot de passe identique.' }
  */
  try {
    // Peut être appelé de manière anonyme (lors de la première connexion) ou via JWT (req.user)
    const { email, currentPassword, newPassword } = req.body;
    const targetEmail = req.user ? req.user.email : email;

    if (!targetEmail || !currentPassword || !newPassword) {
      return sendError(res, 400, 'Email, mot de passe actuel et nouveau mot de passe sont requis.');
    }

    if (currentPassword === newPassword) {
      return sendError(res, 400, 'Le nouveau mot de passe doit être différent de l\'ancien.');
    }

    await changePasswordService(targetEmail, currentPassword, newPassword);

    return sendSuccess(res, 200, 'Mot de passe modifié avec succès.');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

/**
 * Contrôleur pour rafraîchir le token
 * POST /api/auth/refresh-token
 */
export const refreshToken = async (req, res) => {
  /*
    #swagger.tags = ['Authentification']
    #swagger.summary = 'Rafraîchir le token d\'accès'
    #swagger.description = 'Utilise le refresh token stocké dans les cookies (HttpOnly) pour obtenir un nouveau token.'
  */
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      return sendError(res, 401, 'Refresh token manquant.');
    }

    const result = await refreshTokenService(oldRefreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, 200, 'Token rafraîchi avec succès', { token: result.token });
  } catch (error) {
    return sendError(res, 403, error.message);
  }
};

/**
 * Contrôleur pour la déconnexion
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  /*
    #swagger.tags = ['Authentification']
    #swagger.summary = 'Déconnexion'
    #swagger.description = 'Invalide le refresh token et supprime le cookie.'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
  try {
    if (req.user) {
      await logoutService(req.user.idUtilisateur);
    }
    res.clearCookie('refreshToken');
    return sendSuccess(res, 200, 'Déconnexion réussie.');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
