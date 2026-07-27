-- DropForeignKey
ALTER TABLE "AvisCredit" DROP CONSTRAINT "AvisCredit_bonEquipementId_fkey";

-- AlterTable
ALTER TABLE "AvisCredit" ALTER COLUMN "bonEquipementId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AvisCredit" ADD CONSTRAINT "AvisCredit_bonEquipementId_fkey" FOREIGN KEY ("bonEquipementId") REFERENCES "BonEquipement"("numBon") ON DELETE SET NULL ON UPDATE CASCADE;
