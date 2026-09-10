'use client';

import { useState, useMemo } from 'react';
import {
  Product,
  ProductFormData,
  ProductImageItem,
  CategoryFilter,
  StatusFilter,
  SpotlightFilter,
  SortOption
} from '@/types/product';
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImage,
  updateProductImage,
  deleteProductImage
} from '@/lib/services/admin-product.client';

import { ProductToolbar } from '@/components/admin/products/ProductToolbar';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { ProductCardList } from '@/components/admin/products/ProductCardList';
import { ProductPagination } from '@/components/admin/products/ProductPagination';
import { ProductModal } from '@/components/admin/products/ProductModal';
import { DeleteConfirmModal } from '@/components/admin/products/DeleteConfirmModal';

interface MinimalCategory {
  id: string;
  name: string;
  slug?: string;
}

interface ProductsClientViewProps {
  initialProducts: Product[];
  categories: MinimalCategory[];
}

export function ProductsClientView({
  initialProducts,
  categories
}: ProductsClientViewProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const PAGE_SIZE = 8;
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [spotlightFilter, setSpotlightFilter] =
    useState<SpotlightFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.asin &&
            product.asin.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          categoryFilter === 'all' || product.categoryId === categoryFilter;

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' && product.isPublished) ||
          (statusFilter === 'draft' && !product.isPublished);

        const matchesSpotlight =
          spotlightFilter === 'all' ||
          (spotlightFilter === 'featured' && product.isFeatured) ||
          (spotlightFilter === 'trending' && product.isTrending);

        return (
          matchesSearch && matchesCategory && matchesStatus && matchesSpotlight
        );
      })
      .sort((a, b) => {
        if (sortOption === 'newest')
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (sortOption === 'oldest')
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        if (sortOption === 'name') return a.name.localeCompare(b.name);
        if (sortOption === 'price') return b.price - a.price;
        if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [
    products,
    searchQuery,
    categoryFilter,
    statusFilter,
    spotlightFilter,
    sortOption
  ]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (
    formData: ProductFormData,
    modalImages: Array<ProductImageItem & { file?: File; isNew?: boolean }>,
    deletedImageIds: string[]
  ) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        // 1. Update basic product details
        const updatedProduct = await updateAdminProduct(
          editingProduct.id,
          formData
        );

        // 2. Delete removed images
        for (const imgId of deletedImageIds) {
          await deleteProductImage(editingProduct.id, imgId);
        }

        // 3. Process new or existing image updates
        const processedImages: ProductImageItem[] = [];
        for (let i = 0; i < modalImages.length; i++) {
          const img = modalImages[i];
          if (img.isNew && img.file) {
            const uploadedImage = await uploadProductImage(
              editingProduct.id,
              img.file,
              img.altText || `${formData.name} image`,
              img.isPrimary
            );
            processedImages.push(uploadedImage);
          } else if (img.id) {
            await updateProductImage(editingProduct.id, img.id, {
              altText: img.altText,
              displayOrder: i,
              isPrimary: img.isPrimary
            });
            processedImages.push({
              ...img,
              displayOrder: i
            });
          }
        }

        const selectedCategory = categories.find(
          (c) => c.id === formData.categoryId
        );
        const categoryName = selectedCategory
          ? selectedCategory.name
          : updatedProduct.categoryName || 'Uncategorized';

        const primaryImg =
          processedImages.find((i) => i.isPrimary) || processedImages[0];

        const finalProductObj: Product = {
          ...updatedProduct,
          categoryName,
          images: processedImages,
          imageUrl: primaryImg?.url ?? null,
          imagePublicId: primaryImg?.publicId ?? null
        };

        setProducts((prev) =>
          prev.map((item) =>
            item.id === editingProduct.id ? finalProductObj : item
          )
        );
      } else {
        // 1. Create product record first
        const newProduct = await createAdminProduct(formData);

        const processedImages: ProductImageItem[] = [];
        for (let i = 0; i < modalImages.length; i++) {
          const img = modalImages[i];
          if (img.file) {
            const uploadedImage = await uploadProductImage(
              newProduct.id,
              img.file,
              img.altText || `${formData.name} image`,
              img.isPrimary
            );
            processedImages.push(uploadedImage);
          }
        }

        const selectedCategory = categories.find(
          (c) => c.id === formData.categoryId
        );
        const categoryName = selectedCategory
          ? selectedCategory.name
          : 'Uncategorized';

        const primaryImg =
          processedImages.find((i) => i.isPrimary) || processedImages[0];

        const finalNewProduct: Product = {
          ...newProduct,
          categoryName,
          images: processedImages,
          imageUrl: primaryImg?.url ?? null,
          imagePublicId: primaryImg?.publicId ?? null
        };

        setProducts((prev) => [finalNewProduct, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save product.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (deletingProduct) {
      try {
        setIsLoading(true);
        await deleteAdminProduct(deletingProduct.id);
        setProducts((prev) =>
          prev.filter((item) => item.id !== deletingProduct.id)
        );
        setDeletingProduct(null);
      } catch (error: unknown) {
        console.error(error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete product.';
        alert(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full space-y-3.5 sm:space-y-4 md:space-y-5 p-3.5 sm:p-5 md:p-6">
      {/* Top Floating Card: Toolbar */}
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
        <ProductToolbar
          totalCount={products.length}
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          categoryFilter={categoryFilter}
          onCategoryChange={(cat) => {
            setCategoryFilter(cat);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(status) => {
            setStatusFilter(status);
            setCurrentPage(1);
          }}
          spotlightFilter={spotlightFilter}
          onSpotlightChange={(spotlight) => {
            setSpotlightFilter(spotlight);
            setCurrentPage(1);
          }}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onAddProduct={handleOpenAddModal}
          categories={categories}
        />
      </div>

      {/* Bottom Floating Card: Table / Content List */}
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
        {paginatedProducts.length > 0 ? (
          <>
            <ProductTable
              products={paginatedProducts}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingProduct}
            />
            <ProductCardList
              products={paginatedProducts}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingProduct}
            />
          </>
        ) : (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] sm:p-12">
            No products found matching your filter criteria.
          </div>
        )}

        {/* Pagination Footer */}
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalFilteredCount={filteredProducts.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Dialogs */}
      <ProductModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        categories={categories}
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}
