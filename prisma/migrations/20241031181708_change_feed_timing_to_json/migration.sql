/*
  Warnings:

  - The `transferTiming` column on the `TransferFeed` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TransferFeed" DROP COLUMN "transferTiming",
ADD COLUMN     "transferTiming" JSONB;
