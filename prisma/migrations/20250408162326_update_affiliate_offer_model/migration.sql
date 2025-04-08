/*
  Warnings:

  - You are about to drop the column `network` on the `AffiliateOffer` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `LandingPage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AffiliateNetwork` will be added. If there are existing duplicate values, this will fail.
  - Made the column `affiliateNetworkId` on table `AffiliateOffer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AffiliateOffer" DROP CONSTRAINT "AffiliateOffer_affiliateNetworkId_fkey";

-- AlterTable
ALTER TABLE "AffiliateOffer" DROP COLUMN "network",
ALTER COLUMN "affiliateNetworkId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "content",
DROP COLUMN "description";

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateNetwork_name_key" ON "AffiliateNetwork"("name");

-- AddForeignKey
ALTER TABLE "AffiliateOffer" ADD CONSTRAINT "AffiliateOffer_affiliateNetworkId_fkey" FOREIGN KEY ("affiliateNetworkId") REFERENCES "AffiliateNetwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
