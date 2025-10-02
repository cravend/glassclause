-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('Processing', 'Safe', 'Caution', 'Escalate', 'Failed');

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContractStatus" NOT NULL DEFAULT 'Processing',

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
