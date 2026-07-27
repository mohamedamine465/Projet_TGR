import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '#config/db.js';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}
const JWT_EXPIRES_IN = '15m'; // Access token de courte durée (15 min)

/**
 * Logique métier de l'authentification
 */
export const loginService = async (email, password) => {
  const user = await prisma.utilisateur.findUnique({
    where: { email },
    include: {
      typeUtilisateur: true,
      profils: true
    }
  });

  if (!user) {
    throw new Error('Identifiants incorrects.');
  }

  // Vérification sécurisée du mot de passe avec bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Identifiants incorrects.');
  }

  // Logique Métier TGR : Première connexion détectée (mot de passe provisoire)
  if (!user.dateDernierAcces) {
    return {
      first_login: true,
      message: 'Première connexion détectée. Veuillez changer obligatoirement votre mot de passe temporaire pour accéder au système.',
      email: user.email
    };
  }

  // Génération du Refresh Token
  const refreshToken = crypto.randomBytes(40).toString('hex');

  // Mise à jour de la date de dernier accès et du refresh token
  await prisma.utilisateur.update({
    where: { idUtilisateur: user.idUtilisateur },
    data: { 
      dateDernierAcces: new Date(),
      refreshToken: refreshToken
    }
  });

  // Génération du JWT (Stateful JWT par payload)
  const token = jwt.sign(
    { 
      userId: user.idUtilisateur,
      type: user.typeUtilisateur.libelleType 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    first_login: false,
    token,
    refreshToken,
    user: {
      idUtilisateur: user.idUtilisateur,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      typeUtilisateur: user.typeUtilisateur,
      profils: user.profils
    }
  };
};

/**
 * Logique métier du changement de mot de passe
 */
export const changePasswordService = async (email, currentPassword, newPassword) => {
  const user = await prisma.utilisateur.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Utilisateur introuvable.');
  }

  // Validation de l'ancien mot de passe
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Mot de passe actuel incorrect.');
  }

  // Contrainte de sécurité : Longueur et complexité minimale
  if (newPassword.length < 8) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.');
  }

  // Salage et Hachage du nouveau mot de passe
  const salt = await bcrypt.genSalt(12); // Facteur de coût de 12 (standard robuste)
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Mise à jour en base de données
  await prisma.utilisateur.update({
    where: { idUtilisateur: user.idUtilisateur },
    data: {
      password: hashedPassword,
      dateModificationpasswd: new Date(),
      // Si c'était la première connexion, on initialise dateDernierAcces pour débloquer l'utilisateur
      ...(user.dateDernierAcces === null && { dateDernierAcces: new Date() })
    }
  });

  return true;
};

/**
 * Logique métier du rafraîchissement de token
 */
export const refreshTokenService = async (oldRefreshToken) => {
  const user = await prisma.utilisateur.findFirst({
    where: { refreshToken: oldRefreshToken },
    include: {
      typeUtilisateur: true
    }
  });

  if (!user) {
    throw new Error('Refresh token invalide.');
  }

  // Génération d\'un nouveau Refresh Token pour la rotation (sécurité supplémentaire)
  const newRefreshToken = crypto.randomBytes(40).toString('hex');

  await prisma.utilisateur.update({
    where: { idUtilisateur: user.idUtilisateur },
    data: { refreshToken: newRefreshToken }
  });

  const newToken = jwt.sign(
    { 
      userId: user.idUtilisateur,
      type: user.typeUtilisateur.libelleType 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token: newToken,
    refreshToken: newRefreshToken
  };
};

/**
 * Logique métier de la déconnexion
 */
export const logoutService = async (userId) => {
  await prisma.utilisateur.update({
    where: { idUtilisateur: userId },
    data: { refreshToken: null } // Invalide le refresh token
  });
  return true;
};
