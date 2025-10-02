/*
  Warnings:

  - The values [Safe] on the enum `RiskLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RiskLevel_new" AS ENUM ('Caution', 'Escalate');
ALTER TABLE "Flag" ALTER COLUMN "risk" TYPE "RiskLevel_new" USING ("risk"::text::"RiskLevel_new");
ALTER TYPE "RiskLevel" RENAME TO "RiskLevel_old";
ALTER TYPE "RiskLevel_new" RENAME TO "RiskLevel";
DROP TYPE "public"."RiskLevel_old";
COMMIT;
