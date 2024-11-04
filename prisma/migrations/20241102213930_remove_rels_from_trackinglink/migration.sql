/*
  Warnings:

  - You are about to drop the column `trackingLinkId` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `offerId` on the `TrackingLink` table. All the data in the column will be lost.
  - You are about to drop the column `placementId` on the `TrackingLink` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_trackingLinkId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingLink" DROP CONSTRAINT "TrackingLink_offerId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingLink" DROP CONSTRAINT "TrackingLink_placementId_fkey";

-- AlterTable
ALTER TABLE "Click" DROP COLUMN "trackingLinkId";

-- AlterTable
ALTER TABLE "TrackingLink" DROP COLUMN "offerId",
DROP COLUMN "placementId";
