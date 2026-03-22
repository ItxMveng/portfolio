-- AlterTable: Project
ALTER TABLE "Project"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'web',
ADD COLUMN "year" TEXT,
ADD COLUMN "processSummary" TEXT,
ADD COLUMN "processSteps" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable: BlogPost
ALTER TABLE "BlogPost"
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'article',
ADD COLUMN "tools" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "contentBlocks" JSONB,
ADD COLUMN "coverImageUrl" TEXT,
ADD COLUMN "videoUrl" TEXT,
ADD COLUMN "githubUrl" TEXT,
ADD COLUMN "downloadUrl" TEXT,
ADD COLUMN "ctaLabel" TEXT,
ADD COLUMN "ctaUrl" TEXT;

-- Data migration: keep year readable in cards
UPDATE "Project"
SET "year" = EXTRACT(YEAR FROM "createdAt")::TEXT
WHERE "year" IS NULL;
