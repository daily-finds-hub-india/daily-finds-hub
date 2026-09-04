CREATE TABLE "CategoryImage" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CategoryImage_categoryId_idx" ON "CategoryImage"("categoryId");

ALTER TABLE "CategoryImage" ADD CONSTRAINT "CategoryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "CategoryImage" ("id", "categoryId", "url", "publicId", "altText", "isPrimary")
SELECT md5(random()::text || clock_timestamp()::text), "id", "image", "imagePublicId", "name", true
FROM "Category"
WHERE "image" <> '' AND "imagePublicId" IS NOT NULL;