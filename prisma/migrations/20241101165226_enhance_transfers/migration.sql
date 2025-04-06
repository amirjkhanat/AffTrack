/*
  Warnings:

  - You are about to drop the column `prePingId` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `Transfer` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransferStatus" ADD VALUE 'FAILED_PING';
ALTER TYPE "TransferStatus" ADD VALUE 'FAILED_MAIN';

-- AlterTable
ALTER TABLE "Transfer" DROP COLUMN "prePingId",
DROP COLUMN "response";
