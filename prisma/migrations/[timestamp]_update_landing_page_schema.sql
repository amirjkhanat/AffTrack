-- Create a temporary table with the new structure
CREATE TABLE "_LandingPage_new" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- Copy data from the old table to the new table
INSERT INTO "_LandingPage_new" ("id", "name", "baseUrl", "parameters", "description", "status", "userId", "createdAt", "updatedAt")
SELECT "id", "name", "url", '{}'::jsonb, "description", "status", "userId", "createdAt", "updatedAt"
FROM "LandingPage";

-- Drop the old table
DROP TABLE "LandingPage";

-- Rename the new table to the original name
ALTER TABLE "_LandingPage_new" RENAME TO "LandingPage";

-- Recreate the foreign key constraints
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Recreate indexes
CREATE INDEX "LandingPage_userId_idx" ON "LandingPage"("userId"); 