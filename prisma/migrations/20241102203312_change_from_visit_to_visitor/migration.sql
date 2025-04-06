/*
  Warnings:

  - You are about to drop the column `visitId` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `visitId` on the `Conversion` table. All the data in the column will be lost.
  - You are about to drop the column `visitId` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `visitorId` to the `Click` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitorId` to the `Conversion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_visitId_fkey";

-- DropForeignKey
ALTER TABLE "Conversion" DROP CONSTRAINT "Conversion_visitId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_visitId_fkey";

-- AlterTable
ALTER TABLE "Click" DROP COLUMN "visitId",
ADD COLUMN     "visitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Conversion" DROP COLUMN "visitId",
ADD COLUMN     "visitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "visitId",
ADD COLUMN     "visitorId" TEXT;

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
