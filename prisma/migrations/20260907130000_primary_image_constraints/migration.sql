CREATE UNIQUE INDEX "ProductImage_one_primary_per_product"
ON "ProductImage" ("productId")
WHERE "isPrimary" = true;

CREATE UNIQUE INDEX "CategoryImage_one_primary_per_category"
ON "CategoryImage" ("categoryId")
WHERE "isPrimary" = true;