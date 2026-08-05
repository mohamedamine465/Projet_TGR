import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du nettoyage de la base de données...');

  // 1. Nettoyage de la BDD (l'ordre est important pour respecter les clés étrangères)
  await prisma.ligne.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.avisRejet.deleteMany();
  await prisma.avisCredit.deleteMany();
  await prisma.avisCreditAdjudication.deleteMany();
  await prisma.approvisionnement.deleteMany();
  await prisma.avisDebit.deleteMany();
  await prisma.avisOperation.deleteMany();
  await prisma.commissionMaroclear.deleteMany();
  await prisma.interet.deleteMany();
  await prisma.depense.deleteMany();
  await prisma.recette.deleteMany();
  await prisma.oPCommissionMaroclear.deleteMany();
  await prisma.ordrePaiement.deleteMany();
  await prisma.echeance.deleteMany();
  await prisma.echeancier.deleteMany();
  
  await prisma.don.deleteMany();
  await prisma.fondRoulement.deleteMany();
  await prisma.attestation.deleteMany();
  await prisma.projet.deleteMany();
  
  await prisma.adresse.deleteMany();
  await prisma.pret.deleteMany();
  await prisma.preteur.deleteMany();
  await prisma.preteurProjet.deleteMany();
  
  await prisma.adjudication.deleteMany();
  await prisma.bonEquipement.deleteMany();
  await prisma.banque.deleteMany();
  await prisma.souscripteur.deleteMany();
  await prisma.bordereauEmission.deleteMany();
  
  await prisma.utilisateur.deleteMany();
  await prisma.profil.deleteMany();
  await prisma.typeUtilisateur.deleteMany();

  console.log('Nettoyage terminé.');

  // 2. Création des Profils et TypeUtilisateur
  console.log('Création des profils...');
  const profilsData = [
    "Dette du Tresor",
    "Projets",
    "Dette Interieure"
  ];
  
  const profils = [];
  for (const libelle of profilsData) {
    const profil = await prisma.profil.create({
      data: { libelleProfil: libelle }
    });
    profils.push(profil);
  }

  const typeAdmin = await prisma.typeUtilisateur.create({
    data: { libelleType: "Administrateur" }
  });

  const typeAgent = await prisma.typeUtilisateur.create({
    data: { libelleType: "Agent" }
  });

  // 3. Création des Utilisateurs
  console.log('Création des utilisateurs...');
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  const adminUser = await prisma.utilisateur.create({
    data: {
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@tgr.gov.ma',
      password: hashedPassword,
      typeUtilisateurId: typeAdmin.idType,
      dateDernierAcces: new Date(), // Important pour éviter la page de 1ère connexion
      profils: {
        connect: [
          { idProfil: profils[0].idProfil },
          { idProfil: profils[1].idProfil },
          { idProfil: profils[2].idProfil }
        ]
      }
    }
  });

  const utilisateurs = [adminUser];
  for (let i = 0; i < profilsData.length; i++) {
    const agentPassword = await bcrypt.hash(`agent${i+1}`, 10);
    const u = await prisma.utilisateur.create({
      data: {
        nom: `Agent${i+1}`,
        prenom: profilsData[i].split(' ')[0],
        email: `agent${i+1}@tgr.gov.ma`,
        password: agentPassword,
        typeUtilisateurId: typeAgent.idType,
        profils: {
          connect: [{ idProfil: profils[i].idProfil }]
        }
      }
    });
    utilisateurs.push(u);
  }

  // 4. Création des Prêteurs (Dette Trésor)
  console.log('Création des prêteurs...');
  const preteur1 = await prisma.preteur.create({
    data: {
      codeCategorie: 101,
      maturite: 'C',
      designation: 'Banque Mondiale',
      adresses: {
        create: [ { adresse: 'Washington DC' } ]
      }
    }
  });

  const preteur2 = await prisma.preteur.create({
    data: {
      codeCategorie: 102,
      maturite: 'L',
      designation: 'Fonds Monétaire International',
      adresses: {
        create: [ { adresse: 'Washington DC, USA' } ]
      }
    }
  });

  // 5. Création de 5 Prêts (Dette Trésor) avec Echeanciers
  console.log('Création des prêts et échéanciers...');
  for (let i = 1; i <= 5; i++) {
    await prisma.pret.create({
      data: {
        numPret: BigInt(1000000 + i),
        dateCreation: new Date(),
        objet: `Construction Infrastructure Lot ${i}`,
        soldeCourant: BigInt(50000000 * i),
        numEmprunt: `EMP2026-${i}`,
        preteurId: i % 2 === 0 ? preteur2.codeCategorie : preteur1.codeCategorie,
        updatedById: adminUser.idUtilisateur,
        echeanciers: {
          create: {
            tranche: 1,
            echeances: {
              create: [
                {
                  dateEcheance: new Date('2026-12-31'),
                  montantCapital: 1000000 * i,
                  montantInteret: 50000 * i,
                  montantCommission: 5000,
                  statut: 'En attente'
                },
                {
                  dateEcheance: new Date('2027-12-31'),
                  montantCapital: 1000000 * i,
                  montantInteret: 40000 * i,
                  montantCommission: 5000,
                  statut: 'En attente'
                }
              ]
            }
          }
        }
      }
    });
  }

  // 6. Preteur Projet
  const preteurProjet = await prisma.preteurProjet.create({
    data: {
      codePreteur: "P-MEDA",
      intitule: "Union Européenne"
    }
  });

  // 7. Création de Projets (Programme MEDA)
  console.log('Création des projets...');
  for (let i = 1; i <= 5; i++) {
    const isDon = i % 2 === 0;
    const projetData = {
      gestion: 2026 + i,
      datePEC: new Date(),
      superviseurId: adminUser.idUtilisateur,
    };

    if (isDon) {
      projetData.don = {
        create: {
          numDon: 500 + i,
          objet: `Don pour développement rural phase ${i}`
        }
      };
    } else {
      projetData.fondRoulement = {
        create: {
          numContrat: 800 + i,
          preteurId: preteurProjet.codePreteur
        }
      };
    }

    const projet = await prisma.projet.create({ data: projetData });
    
    // Add Approvisionnement (Recette)
    await prisma.recette.create({
      data: {
        datePEC: new Date(),
        dateEcheance: new Date('2027-01-01'),
        projetId: projet.idProjet,
        createdById: adminUser.idUtilisateur,
        approvisionnement: {
          create: {
            cumulApprovis: 1,
            montantApprovis: 150000 * i,
            reference: `APP-${i}`,
            numAvance: 1
          }
        }
      }
    });

    // Add AvisOperation (Depense)
    await prisma.depense.create({
      data: {
        datePEC: new Date(),
        dateEcheance: new Date('2026-10-01'),
        projetId: projet.idProjet,
        createdById: adminUser.idUtilisateur,
        avisOperation: {
          create: {
            numFacture: 1000 + i,
            montantDispo: 50000 * i,
            partFinancee: 20000 * i
          }
        }
      }
    });
  }

  // 8. Création Dette Intérieure (Adjudications, BonsEquipement)
  console.log('Création des Adjudications et Bons d\'Equipement...');
  for (let i = 1; i <= 5; i++) {
    await prisma.adjudication.create({
      data: {
        dateJouissance: new Date(),
        maturite: '5 ans',
        taux: 3.5 + (i * 0.1),
        montant: 10000000 * i
      }
    });
    
    await prisma.bonEquipement.create({
      data: {
        dateSouscription: new Date(),
        montant: 500000 * i,
        datePEC: new Date()
      }
    });

    await prisma.depense.create({
      data: {
        datePEC: new Date(),
        dateEcheance: new Date('2026-11-01'),
        createdById: adminUser.idUtilisateur,
        commissionMaroclear: {
          create: {
            refFacture: 2000 + i,
            montantTotal: 15000 * i
          }
        }
      }
    });

    await prisma.depense.create({
      data: {
        datePEC: new Date(),
        dateEcheance: new Date('2026-12-01'),
        createdById: adminUser.idUtilisateur,
        interet: {
          create: {
            annee: 2026,
            trimestre: (i % 4) + 1,
            tauxInteret: 4.5 + i,
            nbreJour: 90
          }
        }
      }
    });
  }

  console.log('Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
