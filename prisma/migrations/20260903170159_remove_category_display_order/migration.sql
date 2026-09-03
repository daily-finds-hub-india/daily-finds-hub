/*
  Warnings:

  - You are about to drop the column `displayOrder` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "displayOrder",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
