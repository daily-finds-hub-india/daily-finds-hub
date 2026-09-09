-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Category_isPublished_idx" ON "Category"("isPublished");
