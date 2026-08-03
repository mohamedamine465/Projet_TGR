-- DropForeignKey
ALTER TABLE "Adresse" DROP CONSTRAINT "Adresse_preteurId_fkey";

-- DropForeignKey
ALTER TABLE "Attestation" DROP CONSTRAINT "Attestation_projetId_fkey";

-- DropForeignKey
ALTER TABLE "AvisRejet" DROP CONSTRAINT "AvisRejet_bonId_fkey";

-- DropForeignKey
ALTER TABLE "Echeance" DROP CONSTRAINT "Echeance_echeancierId_fkey";

-- DropForeignKey
ALTER TABLE "Echeancier" DROP CONSTRAINT "Echeancier_pretId_fkey";

-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_opMaroclearId_fkey";

-- AddForeignKey
ALTER TABLE "Adresse" ADD CONSTRAINT "Adresse_preteurId_fkey" FOREIGN KEY ("preteurId") REFERENCES "Preteur"("codeCategorie") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Echeancier" ADD CONSTRAINT "Echeancier_pretId_fkey" FOREIGN KEY ("pretId") REFERENCES "Pret"("numPret") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Echeance" ADD CONSTRAINT "Echeance_echeancierId_fkey" FOREIGN KEY ("echeancierId") REFERENCES "Echeancier"("codeEcheancier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("idProjet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisRejet" ADD CONSTRAINT "AvisRejet_bonId_fkey" FOREIGN KEY ("bonId") REFERENCES "BonEquipement"("numBon") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_opMaroclearId_fkey" FOREIGN KEY ("opMaroclearId") REFERENCES "OPCommissionMaroclear"("idOPMaroclear") ON DELETE CASCADE ON UPDATE CASCADE;
