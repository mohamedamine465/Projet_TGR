-- CreateTable
CREATE TABLE "Utilisateur" (
    "idUtilisateur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDernierAcces" TIMESTAMP(3),
    "dateModificationpasswd" TIMESTAMP(3),
    "typeUtilisateurId" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("idUtilisateur")
);

-- CreateTable
CREATE TABLE "Profil" (
    "idProfil" SERIAL NOT NULL,
    "libelleProfil" TEXT NOT NULL,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("idProfil")
);

-- CreateTable
CREATE TABLE "TypeUtilisateur" (
    "idType" SERIAL NOT NULL,
    "libelleType" TEXT NOT NULL,

    CONSTRAINT "TypeUtilisateur_pkey" PRIMARY KEY ("idType")
);

-- CreateTable
CREATE TABLE "Preteur" (
    "codeCategorie" INTEGER NOT NULL,
    "maturite" CHAR(1) NOT NULL,
    "designation" TEXT NOT NULL,

    CONSTRAINT "Preteur_pkey" PRIMARY KEY ("codeCategorie")
);

-- CreateTable
CREATE TABLE "Adresse" (
    "idAdresse" SERIAL NOT NULL,
    "adresse" TEXT NOT NULL,
    "preteurId" INTEGER NOT NULL,

    CONSTRAINT "Adresse_pkey" PRIMARY KEY ("idAdresse")
);

-- CreateTable
CREATE TABLE "Pret" (
    "numPret" BIGINT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL,
    "objet" TEXT NOT NULL,
    "soldeCourant" BIGINT NOT NULL,
    "numEmprunt" TEXT NOT NULL,
    "preteurId" INTEGER NOT NULL,
    "updatedById" INTEGER,

    CONSTRAINT "Pret_pkey" PRIMARY KEY ("numPret")
);

-- CreateTable
CREATE TABLE "Echeancier" (
    "codeEcheancier" SERIAL NOT NULL,
    "tranche" INTEGER NOT NULL,
    "pretId" BIGINT NOT NULL,

    CONSTRAINT "Echeancier_pkey" PRIMARY KEY ("codeEcheancier")
);

-- CreateTable
CREATE TABLE "Echeance" (
    "idEcheance" SERIAL NOT NULL,
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "montantCapital" DOUBLE PRECISION NOT NULL,
    "montantInteret" DOUBLE PRECISION NOT NULL,
    "montantCommission" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL,
    "echeancierId" INTEGER NOT NULL,

    CONSTRAINT "Echeance_pkey" PRIMARY KEY ("idEcheance")
);

-- CreateTable
CREATE TABLE "Projet" (
    "idProjet" SERIAL NOT NULL,
    "gestion" INTEGER NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,
    "superviseurId" INTEGER,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("idProjet")
);

-- CreateTable
CREATE TABLE "Don" (
    "idDon" SERIAL NOT NULL,
    "numDon" INTEGER NOT NULL,
    "objet" TEXT NOT NULL,
    "projetId" INTEGER NOT NULL,

    CONSTRAINT "Don_pkey" PRIMARY KEY ("idDon")
);

-- CreateTable
CREATE TABLE "FondRoulement" (
    "idFond" SERIAL NOT NULL,
    "numContrat" INTEGER NOT NULL,
    "projetId" INTEGER NOT NULL,
    "preteurId" TEXT NOT NULL,

    CONSTRAINT "FondRoulement_pkey" PRIMARY KEY ("idFond")
);

-- CreateTable
CREATE TABLE "Attestation" (
    "idAttestation" SERIAL NOT NULL,
    "typeEmiss" TEXT NOT NULL,
    "montantMarche" DOUBLE PRECISION NOT NULL,
    "taxe" DOUBLE PRECISION NOT NULL,
    "tauxFinance" DOUBLE PRECISION NOT NULL,
    "objet" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,
    "numEnvoi" INTEGER NOT NULL,
    "numVisa" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "projetId" INTEGER NOT NULL,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("idAttestation")
);

-- CreateTable
CREATE TABLE "PreteurProjet" (
    "codePreteur" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,

    CONSTRAINT "PreteurProjet_pkey" PRIMARY KEY ("codePreteur")
);

-- CreateTable
CREATE TABLE "Recette" (
    "codeRecette" SERIAL NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pretId" BIGINT,
    "projetId" INTEGER,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Recette_pkey" PRIMARY KEY ("codeRecette")
);

-- CreateTable
CREATE TABLE "AvisCreditAdjudication" (
    "idAvisCreditAdj" SERIAL NOT NULL,
    "montantNominal" DOUBLE PRECISION NOT NULL,
    "couponCouru" DOUBLE PRECISION NOT NULL,
    "montantAvisCredit" DOUBLE PRECISION NOT NULL,
    "montantPlusValue" DOUBLE PRECISION NOT NULL,
    "montantMoinsValue" DOUBLE PRECISION NOT NULL,
    "recetteId" INTEGER NOT NULL,
    "adjudicationId" INTEGER NOT NULL,

    CONSTRAINT "AvisCreditAdjudication_pkey" PRIMARY KEY ("idAvisCreditAdj")
);

-- CreateTable
CREATE TABLE "AvisCredit" (
    "idAvisCredit" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "taux" INTEGER NOT NULL,
    "recetteId" INTEGER NOT NULL,
    "bonEquipementId" INTEGER NOT NULL,

    CONSTRAINT "AvisCredit_pkey" PRIMARY KEY ("idAvisCredit")
);

-- CreateTable
CREATE TABLE "Approvisionnement" (
    "idApprovis" SERIAL NOT NULL,
    "cumulApprovis" INTEGER NOT NULL,
    "montantApprovis" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "numAvance" INTEGER NOT NULL,
    "recetteId" INTEGER NOT NULL,

    CONSTRAINT "Approvisionnement_pkey" PRIMARY KEY ("idApprovis")
);

-- CreateTable
CREATE TABLE "Depense" (
    "codeDepense" SERIAL NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pretId" BIGINT,
    "projetId" INTEGER,
    "ordrePaiementId" INTEGER,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("codeDepense")
);

-- CreateTable
CREATE TABLE "AvisDebit" (
    "idAvisDebit" SERIAL NOT NULL,
    "dateDepense" TIMESTAMP(3) NOT NULL,
    "taux" DOUBLE PRECISION NOT NULL,
    "montantCapital" DOUBLE PRECISION NOT NULL,
    "montantInteret" DOUBLE PRECISION NOT NULL,
    "montantCommission" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "depenseId" INTEGER NOT NULL,

    CONSTRAINT "AvisDebit_pkey" PRIMARY KEY ("idAvisDebit")
);

-- CreateTable
CREATE TABLE "AvisOperation" (
    "idAvisOp" SERIAL NOT NULL,
    "numFacture" INTEGER NOT NULL,
    "montantDispo" DOUBLE PRECISION NOT NULL,
    "partFinancee" DOUBLE PRECISION NOT NULL,
    "depenseId" INTEGER NOT NULL,

    CONSTRAINT "AvisOperation_pkey" PRIMARY KEY ("idAvisOp")
);

-- CreateTable
CREATE TABLE "CommissionMaroclear" (
    "idCommission" SERIAL NOT NULL,
    "refFacture" INTEGER NOT NULL,
    "montantTotal" DOUBLE PRECISION NOT NULL,
    "depenseId" INTEGER NOT NULL,
    "bordereauId" INTEGER,
    "opMaroclearId" INTEGER,

    CONSTRAINT "CommissionMaroclear_pkey" PRIMARY KEY ("idCommission")
);

-- CreateTable
CREATE TABLE "Interet" (
    "idInteret" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "trimestre" INTEGER NOT NULL,
    "tauxInteret" DOUBLE PRECISION NOT NULL,
    "nbreJour" INTEGER NOT NULL,
    "depenseId" INTEGER NOT NULL,

    CONSTRAINT "Interet_pkey" PRIMARY KEY ("idInteret")
);

-- CreateTable
CREATE TABLE "OrdrePaiement" (
    "numOrdre" SERIAL NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "montantCapital" DOUBLE PRECISION NOT NULL,
    "montantInteret" DOUBLE PRECISION NOT NULL,
    "montantCommission" DOUBLE PRECISION NOT NULL,
    "numlettre" INTEGER NOT NULL,
    "pretId" BIGINT,
    "echeanceId" INTEGER,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "OrdrePaiement_pkey" PRIMARY KEY ("numOrdre")
);

-- CreateTable
CREATE TABLE "OPCommissionMaroclear" (
    "idOPMaroclear" SERIAL NOT NULL,
    "numOP" INTEGER NOT NULL,
    "numLettre" INTEGER NOT NULL,
    "dateOP" TIMESTAMP(3) NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL,
    "taux" DOUBLE PRECISION NOT NULL,
    "ordrePaiementId" INTEGER NOT NULL,

    CONSTRAINT "OPCommissionMaroclear_pkey" PRIMARY KEY ("idOPMaroclear")
);

-- CreateTable
CREATE TABLE "Adjudication" (
    "idAdjudication" SERIAL NOT NULL,
    "dateJouissance" TIMESTAMP(3) NOT NULL,
    "maturite" TEXT NOT NULL,
    "taux" DOUBLE PRECISION NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Adjudication_pkey" PRIMARY KEY ("idAdjudication")
);

-- CreateTable
CREATE TABLE "BonEquipement" (
    "numBon" SERIAL NOT NULL,
    "dateSouscription" TIMESTAMP(3) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BonEquipement_pkey" PRIMARY KEY ("numBon")
);

-- CreateTable
CREATE TABLE "Souscripteur" (
    "idSouscripteur" SERIAL NOT NULL,
    "adresse" TEXT NOT NULL,
    "compteBancaire" TEXT NOT NULL,

    CONSTRAINT "Souscripteur_pkey" PRIMARY KEY ("idSouscripteur")
);

-- CreateTable
CREATE TABLE "Banque" (
    "codeBanque" SERIAL NOT NULL,
    "nomBanque" TEXT NOT NULL,

    CONSTRAINT "Banque_pkey" PRIMARY KEY ("codeBanque")
);

-- CreateTable
CREATE TABLE "AvisRejet" (
    "numAvisRejet" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "datePEC" TIMESTAMP(3) NOT NULL,
    "bonId" INTEGER NOT NULL,

    CONSTRAINT "AvisRejet_pkey" PRIMARY KEY ("numAvisRejet")
);

-- CreateTable
CREATE TABLE "BordereauEmission" (
    "numBord" SERIAL NOT NULL,
    "numDecompte" INTEGER NOT NULL,
    "montantBordereau" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BordereauEmission_pkey" PRIMARY KEY ("numBord")
);

-- CreateTable
CREATE TABLE "Operation" (
    "idOperation" SERIAL NOT NULL,
    "maturite" TEXT NOT NULL,
    "imputation" TEXT NOT NULL,
    "montant_HT" DOUBLE PRECISION NOT NULL,
    "tva" DOUBLE PRECISION NOT NULL,
    "opMaroclearId" INTEGER NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("idOperation")
);

-- CreateTable
CREATE TABLE "Ligne" (
    "idLigne" SERIAL NOT NULL,
    "mois" TEXT NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL,
    "autres" DOUBLE PRECISION NOT NULL,
    "interetId" INTEGER NOT NULL,

    CONSTRAINT "Ligne_pkey" PRIMARY KEY ("idLigne")
);

-- CreateTable
CREATE TABLE "_ProfilToUtilisateur" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProfilToUtilisateur_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BonEquipementToSouscripteur" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BonEquipementToSouscripteur_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BanqueToSouscripteur" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BanqueToSouscripteur_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Don_projetId_key" ON "Don"("projetId");

-- CreateIndex
CREATE UNIQUE INDEX "FondRoulement_projetId_key" ON "FondRoulement"("projetId");

-- CreateIndex
CREATE UNIQUE INDEX "Attestation_projetId_key" ON "Attestation"("projetId");

-- CreateIndex
CREATE UNIQUE INDEX "AvisCreditAdjudication_recetteId_key" ON "AvisCreditAdjudication"("recetteId");

-- CreateIndex
CREATE UNIQUE INDEX "AvisCreditAdjudication_adjudicationId_key" ON "AvisCreditAdjudication"("adjudicationId");

-- CreateIndex
CREATE UNIQUE INDEX "AvisCredit_recetteId_key" ON "AvisCredit"("recetteId");

-- CreateIndex
CREATE UNIQUE INDEX "Approvisionnement_recetteId_key" ON "Approvisionnement"("recetteId");

-- CreateIndex
CREATE UNIQUE INDEX "AvisDebit_depenseId_key" ON "AvisDebit"("depenseId");

-- CreateIndex
CREATE UNIQUE INDEX "AvisOperation_depenseId_key" ON "AvisOperation"("depenseId");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionMaroclear_depenseId_key" ON "CommissionMaroclear"("depenseId");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionMaroclear_opMaroclearId_key" ON "CommissionMaroclear"("opMaroclearId");

-- CreateIndex
CREATE UNIQUE INDEX "Interet_depenseId_key" ON "Interet"("depenseId");

-- CreateIndex
CREATE UNIQUE INDEX "OrdrePaiement_echeanceId_key" ON "OrdrePaiement"("echeanceId");

-- CreateIndex
CREATE UNIQUE INDEX "OPCommissionMaroclear_ordrePaiementId_key" ON "OPCommissionMaroclear"("ordrePaiementId");

-- CreateIndex
CREATE INDEX "_ProfilToUtilisateur_B_index" ON "_ProfilToUtilisateur"("B");

-- CreateIndex
CREATE INDEX "_BonEquipementToSouscripteur_B_index" ON "_BonEquipementToSouscripteur"("B");

-- CreateIndex
CREATE INDEX "_BanqueToSouscripteur_B_index" ON "_BanqueToSouscripteur"("B");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_typeUtilisateurId_fkey" FOREIGN KEY ("typeUtilisateurId") REFERENCES "TypeUtilisateur"("idType") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adresse" ADD CONSTRAINT "Adresse_preteurId_fkey" FOREIGN KEY ("preteurId") REFERENCES "Preteur"("codeCategorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pret" ADD CONSTRAINT "Pret_preteurId_fkey" FOREIGN KEY ("preteurId") REFERENCES "Preteur"("codeCategorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pret" ADD CONSTRAINT "Pret_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Echeancier" ADD CONSTRAINT "Echeancier_pretId_fkey" FOREIGN KEY ("pretId") REFERENCES "Pret"("numPret") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Echeance" ADD CONSTRAINT "Echeance_echeancierId_fkey" FOREIGN KEY ("echeancierId") REFERENCES "Echeancier"("codeEcheancier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_superviseurId_fkey" FOREIGN KEY ("superviseurId") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Don" ADD CONSTRAINT "Don_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("idProjet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FondRoulement" ADD CONSTRAINT "FondRoulement_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("idProjet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FondRoulement" ADD CONSTRAINT "FondRoulement_preteurId_fkey" FOREIGN KEY ("preteurId") REFERENCES "PreteurProjet"("codePreteur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("idProjet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recette" ADD CONSTRAINT "Recette_pretId_fkey" FOREIGN KEY ("pretId") REFERENCES "Pret"("numPret") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recette" ADD CONSTRAINT "Recette_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("idProjet") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recette" ADD CONSTRAINT "Recette_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisCreditAdjudication" ADD CONSTRAINT "AvisCreditAdjudication_recetteId_fkey" FOREIGN KEY ("recetteId") REFERENCES "Recette"("codeRecette") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisCreditAdjudication" ADD CONSTRAINT "AvisCreditAdjudication_adjudicationId_fkey" FOREIGN KEY ("adjudicationId") REFERENCES "Adjudication"("idAdjudication") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisCredit" ADD CONSTRAINT "AvisCredit_recetteId_fkey" FOREIGN KEY ("recetteId") REFERENCES "Recette"("codeRecette") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisCredit" ADD CONSTRAINT "AvisCredit_bonEquipementId_fkey" FOREIGN KEY ("bonEquipementId") REFERENCES "BonEquipement"("numBon") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approvisionnement" ADD CONSTRAINT "Approvisionnement_recetteId_fkey" FOREIGN KEY ("recetteId") REFERENCES "Recette"("codeRecette") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_pretId_fkey" FOREIGN KEY ("pretId") REFERENCES "Pret"("numPret") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("idProjet") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_ordrePaiementId_fkey" FOREIGN KEY ("ordrePaiementId") REFERENCES "OrdrePaiement"("numOrdre") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisDebit" ADD CONSTRAINT "AvisDebit_depenseId_fkey" FOREIGN KEY ("depenseId") REFERENCES "Depense"("codeDepense") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisOperation" ADD CONSTRAINT "AvisOperation_depenseId_fkey" FOREIGN KEY ("depenseId") REFERENCES "Depense"("codeDepense") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionMaroclear" ADD CONSTRAINT "CommissionMaroclear_depenseId_fkey" FOREIGN KEY ("depenseId") REFERENCES "Depense"("codeDepense") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionMaroclear" ADD CONSTRAINT "CommissionMaroclear_bordereauId_fkey" FOREIGN KEY ("bordereauId") REFERENCES "BordereauEmission"("numBord") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionMaroclear" ADD CONSTRAINT "CommissionMaroclear_opMaroclearId_fkey" FOREIGN KEY ("opMaroclearId") REFERENCES "OPCommissionMaroclear"("idOPMaroclear") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interet" ADD CONSTRAINT "Interet_depenseId_fkey" FOREIGN KEY ("depenseId") REFERENCES "Depense"("codeDepense") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdrePaiement" ADD CONSTRAINT "OrdrePaiement_pretId_fkey" FOREIGN KEY ("pretId") REFERENCES "Pret"("numPret") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdrePaiement" ADD CONSTRAINT "OrdrePaiement_echeanceId_fkey" FOREIGN KEY ("echeanceId") REFERENCES "Echeance"("idEcheance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdrePaiement" ADD CONSTRAINT "OrdrePaiement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OPCommissionMaroclear" ADD CONSTRAINT "OPCommissionMaroclear_ordrePaiementId_fkey" FOREIGN KEY ("ordrePaiementId") REFERENCES "OrdrePaiement"("numOrdre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisRejet" ADD CONSTRAINT "AvisRejet_bonId_fkey" FOREIGN KEY ("bonId") REFERENCES "BonEquipement"("numBon") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_opMaroclearId_fkey" FOREIGN KEY ("opMaroclearId") REFERENCES "OPCommissionMaroclear"("idOPMaroclear") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ligne" ADD CONSTRAINT "Ligne_interetId_fkey" FOREIGN KEY ("interetId") REFERENCES "Interet"("idInteret") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilToUtilisateur" ADD CONSTRAINT "_ProfilToUtilisateur_A_fkey" FOREIGN KEY ("A") REFERENCES "Profil"("idProfil") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfilToUtilisateur" ADD CONSTRAINT "_ProfilToUtilisateur_B_fkey" FOREIGN KEY ("B") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BonEquipementToSouscripteur" ADD CONSTRAINT "_BonEquipementToSouscripteur_A_fkey" FOREIGN KEY ("A") REFERENCES "BonEquipement"("numBon") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BonEquipementToSouscripteur" ADD CONSTRAINT "_BonEquipementToSouscripteur_B_fkey" FOREIGN KEY ("B") REFERENCES "Souscripteur"("idSouscripteur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BanqueToSouscripteur" ADD CONSTRAINT "_BanqueToSouscripteur_A_fkey" FOREIGN KEY ("A") REFERENCES "Banque"("codeBanque") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BanqueToSouscripteur" ADD CONSTRAINT "_BanqueToSouscripteur_B_fkey" FOREIGN KEY ("B") REFERENCES "Souscripteur"("idSouscripteur") ON DELETE CASCADE ON UPDATE CASCADE;
