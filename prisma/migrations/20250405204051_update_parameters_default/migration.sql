/*
  Warnings:

  - Made the column `parameters` on table `LandingPage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LandingPage" ALTER COLUMN "parameters" SET NOT NULL,
ALTER COLUMN "parameters" SET DEFAULT '{}';
