/*
  Warnings:

  - The values [NATIVE] on the enum `PlacementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlacementType_new" AS ENUM ('BANNER', 'LINK', 'POPUP', 'WIDGET', 'VIDEO', 'SOCIAL_POST', 'BLOG', 'EMAIL');
ALTER TABLE "AdPlacement" ALTER COLUMN "type" TYPE "PlacementType_new" USING ("type"::text::"PlacementType_new");
ALTER TYPE "PlacementType" RENAME TO "PlacementType_old";
ALTER TYPE "PlacementType_new" RENAME TO "PlacementType";
DROP TYPE "PlacementType_old";
COMMIT;
