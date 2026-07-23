import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed (Initialisation de la BDD)...');

  // 1. Initialisation des Types d'Utilisateur
  let typeAdmin = await prisma.typeUtilisateur.findFirst({ where: { libelleType: 'Administrateur' } });
  if (!typeAdmin) {
    typeAdmin = await prisma.typeUtilisateur.create({ data: { libelleType: 'Administrateur' } });
  }

  let typeSaisie = await prisma.typeUtilisateur.findFirst({ where: { libelleType: 'Agent' } });
  if (!typeSaisie) {
    typeSaisie = await prisma.typeUtilisateur.create({ data: { libelleType: 'Agent' } });
  }
  console.log('✅ Types utilisateurs vérifiés.');

  // 2. Initialisation des Profils Métier
  const profilsData = ['Dette du Tresor', 'Dette Interieure', 'Projets'];
  const profils = [];

  for (const libelle of profilsData) {
    let profil = await prisma.profil.findFirst({ where: { libelleProfil: libelle } });
    if (!profil) {
      profil = await prisma.profil.create({ data: { libelleProfil: libelle } });
    }
    profils.push(profil);
  }
  console.log('✅ Profils métiers vérifiés.');

  // 3. Création de l'utilisateur Administrateur par défaut
  const adminEmail = 'admin@tgr.gov.ma';
  const plainPassword = 'admin'; // Mot de passe temporaire à changer obligatoirement

  // On hache le mot de passe
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  // On upsert l'admin pour s'assurer qu'il a bien les 3 profils et qu'il est réinitialisé si besoin
  const adminUser = await prisma.utilisateur.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Réinitialise le mot de passe si on relance le seed
      typeUtilisateurId: typeAdmin.idType,
      dateDernierAcces: null, // Force le flux "Première Connexion"
      profils: {
        connect: profils.map(p => ({ idProfil: p.idProfil })) // Associe les 3 profils
      }
    },
    create: {
      nom: 'Administrateur',
      prenom: 'Système',
      email: adminEmail,
      password: hashedPassword,
      typeUtilisateurId: typeAdmin.idType,
      dateDernierAcces: null,
      profils: {
        connect: profils.map(p => ({ idProfil: p.idProfil }))
      }
    }
  });

  console.log('✅ Compte administrateur prêt :');
  console.log(`   - Email : ${adminUser.email}`);
  console.log(`   - Mot de passe temporaire : ${plainPassword}`);
  console.log(`   - Profils assignés : ${profilsData.join(', ')}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
