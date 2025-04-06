/*
  Warnings:

  - You are about to drop the column `baseUrl` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `parameters` on the `LandingPage` table. All the data in the column will be lost.
  - Added the required column `htmlPath` to the `LandingPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "baseUrl",
DROP COLUMN "content",
DROP COLUMN "description",
DROP COLUMN "parameters",
ADD COLUMN     "cssPath" TEXT,
ADD COLUMN     "htmlPath" TEXT NOT NULL;
