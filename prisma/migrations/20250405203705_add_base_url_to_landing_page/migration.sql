/*
  Warnings:

  - Added the required column `baseUrl` to the `LandingPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LandingPage" ADD COLUMN     "baseUrl" TEXT NOT NULL;
