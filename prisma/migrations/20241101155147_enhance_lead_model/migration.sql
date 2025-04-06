-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "address" TEXT,
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "dob_dd" INTEGER,
ADD COLUMN     "dob_mm" INTEGER,
ADD COLUMN     "dob_yyyy" INTEGER,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipcode" TEXT;
