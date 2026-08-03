import { prisma } from '#config/db.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Fonction pour générer un mot de passe aléatoire (ex: 8 caractères)
const generateRandomPassword = () => {
    return crypto.randomBytes(4).toString('hex'); // 8 caractères
};

export const getAllUsers = async () => {
    return await prisma.utilisateur.findMany({
        include: {
            typeUtilisateur: true,
            profils: true
        }
    });
};

export const getTypesAndProfils = async () => {
    const types = await prisma.typeUtilisateur.findMany();
    const profils = await prisma.profil.findMany();
    return { types, profils };
};

export const createUser = async (userData, adminUser) => {
    const { nom, prenom, email, typeUtilisateurId, profilIds } = userData;

    // Vérifier le type utilisateur
    const type = await prisma.typeUtilisateur.findUnique({
        where: { idType: Number(typeUtilisateurId) }
    });

    if (!type) throw new Error("Type d'utilisateur introuvable.");

    // Sécurité: L'admin ne peut assigner que les profils qu'il possède
    if (adminUser && adminUser.profils) {
        const adminProfilIds = adminUser.profils.map(p => p.idProfil);
        const hasAllRequestedProfils = profilIds.every(id => adminProfilIds.includes(Number(id)));
        
        if (!hasAllRequestedProfils) {
            throw new Error("Vous ne pouvez assigner que les profils auxquels vous avez vous-même accès.");
        }
    }

    // Règle métier : Un Agent ne peut avoir qu'un seul profil
    if (type.libelleType.toLowerCase() === 'agent' && profilIds.length > 1) {
        throw new Error("Un agent ne peut être affecté qu'à un seul profil métier.");
    }

    const generatedPassword = generateRandomPassword();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("Cet email est déjà utilisé.");
    }

    // Hachage du mot de passe avant stockage
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const newUser = await prisma.utilisateur.create({
        data: {
            nom,
            prenom,
            email,
            password: hashedPassword, 
            typeUtilisateurId: Number(typeUtilisateurId),
            profils: {
                connect: profilIds.map(id => ({ idProfil: Number(id) }))
            }
        },
        include: {
            typeUtilisateur: true,
            profils: true
        }
    });

    // On renvoie le mot de passe généré en clair UNE SEULE FOIS pour l'affichage admin
    return { user: newUser, plainPassword: generatedPassword };
};

export const resetUserPassword = async (idUtilisateur) => {
    const user = await prisma.utilisateur.findUnique({ where: { idUtilisateur: Number(idUtilisateur) } });
    if (!user) throw new Error("Utilisateur introuvable.");

    const generatedPassword = generateRandomPassword();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    await prisma.utilisateur.update({
        where: { idUtilisateur: Number(idUtilisateur) },
        data: {
            password: hashedPassword,
            dateDernierAcces: null // Force le changement de mot de passe à la prochaine connexion
        }
    });

    return generatedPassword;
};
