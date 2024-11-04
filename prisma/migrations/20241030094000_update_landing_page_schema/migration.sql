/*
  Warnings:

  - You are about to drop the column `url` on the `LandingPage` table. All the data in the column will be lost.
  - Added the required column `baseUrl` to the `LandingPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parameters` to the `LandingPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "url",
ADD COLUMN     "baseUrl" TEXT NOT NULL,
ADD COLUMN     "parameters" JSONB NOT NULL;
