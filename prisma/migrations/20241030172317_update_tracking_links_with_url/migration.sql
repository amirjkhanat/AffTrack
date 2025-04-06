-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "TrackingLink" ADD COLUMN     "url" TEXT;
