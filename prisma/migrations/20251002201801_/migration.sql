-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('Queued', 'Running', 'Succeeded', 'Failed');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Safe', 'Caution', 'Escalate');

-- CreateEnum
CREATE TYPE "FlagType" AS ENUM ('Indemnity', 'NonSolicitation', 'GoverningLaw', 'LiquidatedDamages', 'Other');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "analysisError" TEXT,
ADD COLUMN     "analysisStatus" "AnalysisStatus" NOT NULL DEFAULT 'Queued';

-- CreateTable
CREATE TABLE "FlaggedClause" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "type" "FlagType" NOT NULL,
    "risk" "RiskLevel" NOT NULL DEFAULT 'Escalate',
    "snippet" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlaggedClause_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlaggedClause" ADD CONSTRAINT "FlaggedClause_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
