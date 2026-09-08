'use client';

import { useState, useMemo } from 'react';
import {
  initialProducts,
  categories,
  PAGE_SIZE
} from '@/lib/constants/productConstants';
import {
  Product,
  ProductFormData,
  CategoryFilter,
  StatusFilter,
  SpotlightFilter,
  SortOption
} from '@/types/product';

import { ProductToolbar } from '@/components/admin/products/ProductToolbar';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { ProductCardList } from '@/components/admin/products/ProductCardList';
import { ProductPagination } from '@/components/admin/products/ProductPagination';
import { ProductModal } from '@/components/admin/products/ProductModal';
import { DeleteConfirmModal } from '@/components/admin/products/DeleteConfirmModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

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
            new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const handleSaveProduct = (formData: ProductFormData) => {
    const selectedCategory = categories.find(
      (c) => c.id === formData.categoryId
    );
    const categoryName = selectedCategory
      ? selectedCategory.name
      : 'Uncategorized';

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                ...formData,
                categoryName,
                price: Number(formData.price) || 0,
                originalPrice: formData.originalPrice
                  ? Number(formData.originalPrice)
                  : null,
                rating: formData.rating ? Number(formData.rating) : null,
                reviewCount: formData.reviewCount
                  ? Number(formData.reviewCount)
                  : 0,
                amazonUrl: formData.amazonUrl || null,
                asin: formData.asin || null
              }
            : item
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        categoryName,
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : null,
        rating: formData.rating ? Number(formData.rating) : null,
        reviewCount: formData.reviewCount ? Number(formData.reviewCount) : 0,
        amazonUrl: formData.amazonUrl || null,
        asin: formData.asin || null,
        imageUrl: null,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = () => {
    if (deletingProduct) {
      setProducts((prev) =>
        prev.filter((item) => item.id !== deletingProduct.id)
      );
      setDeletingProduct(null);
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
