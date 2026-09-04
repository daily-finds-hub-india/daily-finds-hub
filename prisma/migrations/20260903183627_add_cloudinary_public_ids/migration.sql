/*
  Warnings:

  - Added the required column `publicId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Made the column `altText` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "publicId" TEXT NOT NULL,
ALTER COLUMN "altText" SET NOT NULL;
