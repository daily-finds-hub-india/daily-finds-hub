'use client';

import { useState, useMemo } from 'react';
import {
  initialCategories,
  PAGE_SIZE
} from '@/lib/constants/categoryConstants';
import {
  Category,
  CategoryFormData,
  StatusFilter,
  SpotlightFilter,
  SortOption
} from '@/types/category';

import { CategoryToolbar } from '@/components/admin/categories/CategoryToolbar';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';
import { CategoryCardList } from '@/components/admin/categories/CategoryCardList';
import { CategoryPagination } from '@/components/admin/categories/CategoryPagination';
import { CategoryModal } from '@/components/admin/categories/CategoryModal';
import { DeleteConfirmModal } from '@/components/admin/categories/DeleteConfirmModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [spotlightFilter, setSpotlightFilter] =
    useState<SpotlightFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Filter & Sort Logic
  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        const matchesSearch =
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' && category.isPublished) ||
          (statusFilter === 'draft' && !category.isPublished);

        const matchesSpotlight =
          spotlightFilter === 'all' ||
          (spotlightFilter === 'featured' && category.isFeatured);

        return matchesSearch && matchesStatus && matchesSpotlight;
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
        if (sortOption === 'products') return b.productCount - a.productCount;
        return 0;
      });
  }, [categories, searchQuery, statusFilter, spotlightFilter, sortOption]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (formData: CategoryFormData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingCategory.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
        imageUrl: null,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories((prev) => [newCategory, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      setCategories((prev) =>
        prev.filter((item) => item.id !== deletingCategory.id)
      );
      setDeletingCategory(null);
    }
  };

  return (
    // Controlled responsive page padding + tight 10px spacing between cards
    <div className="w-full space-y-3.5 sm:space-y-4 md:space-y-5 p-3.5 sm:p-5 md:p-6">
      {/* Top Card: Toolbar */}
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
        <CategoryToolbar
          totalCount={categories.length}
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
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
          onAddCategory={handleOpenAddModal}
        />
      </div>
      {/* Bottom Card: Table & List */}
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
        {paginatedCategories.length > 0 ? (
          <>
            <CategoryTable
              categories={paginatedCategories}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingCategory}
            />
            <CategoryCardList
              categories={paginatedCategories}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingCategory}
            />
          </>
        ) : (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] sm:p-12">
            No categories found matching your filter criteria.
          </div>
        )}
        {/* Pagination Footer */}
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalFilteredCount={filteredCategories.length}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        editingCategory={editingCategory}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCategory}
      />
      <DeleteConfirmModal
        isOpen={Boolean(deletingCategory)}
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
