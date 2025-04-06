/*
  Warnings:

  - You are about to drop the column `clickId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `customFields` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_clickId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_visitId_fkey";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "clickId",
DROP COLUMN "customFields",
DROP COLUMN "metadata",
ADD COLUMN     "metaData" JSONB,
ALTER COLUMN "visitId" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "ipAddress" DROP NOT NULL,
ALTER COLUMN "userAgent" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_ClickToLead" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClickToLead_AB_unique" ON "_ClickToLead"("A", "B");

-- CreateIndex
CREATE INDEX "_ClickToLead_B_index" ON "_ClickToLead"("B");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClickToLead" ADD CONSTRAINT "_ClickToLead_A_fkey" FOREIGN KEY ("A") REFERENCES "Click"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClickToLead" ADD CONSTRAINT "_ClickToLead_B_fkey" FOREIGN KEY ("B") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
