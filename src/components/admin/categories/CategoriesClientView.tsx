'use client';

import { useState, useMemo } from 'react';
import {
  Category,
  CategoryFormData,
  CategoryImageItem,
  StatusFilter,
  SpotlightFilter,
  SortOption
} from '@/types/category';
import {
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  uploadCategoryImage,
  updateCategoryImage,
  deleteCategoryImage
} from '@/lib/services/admin-category.client';
import { CategoryToolbar } from '@/components/admin/categories/CategoryToolbar';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';
import { CategoryCardList } from '@/components/admin/categories/CategoryCardList';
import { CategoryPagination } from '@/components/admin/categories/CategoryPagination';
import { CategoryModal } from '@/components/admin/categories/CategoryModal';
import { DeleteConfirmModal } from '@/components/admin/categories/DeleteConfirmModal';

interface CategoriesClientViewProps {
  initialCategories: Category[];
}

export function CategoriesClientView({
  initialCategories
}: CategoriesClientViewProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [spotlightFilter, setSpotlightFilter] =
    useState<SpotlightFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 8;
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

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (
    formData: CategoryFormData,
    modalImages: Array<CategoryImageItem & { file?: File; isNew?: boolean }>,
    deletedImageIds: string[]
  ) => {
    setIsLoading(true);
    try {
      let savedCategory: Category;

      // 1. Create or Update Base Category
      if (editingCategory) {
        savedCategory = await updateAdminCategory(editingCategory.id, formData);
      } else {
        savedCategory = await createAdminCategory(formData);
      }

      // 2. Process Deletions
      if (editingCategory && deletedImageIds.length > 0) {
        await Promise.all(
          deletedImageIds.map((imageId) =>
            deleteCategoryImage(editingCategory.id, imageId)
          )
        );
      }

      // 3. Process Uploads and Updates
      const finalImages: CategoryImageItem[] = [];
      for (let i = 0; i < modalImages.length; i++) {
        const img = modalImages[i];

        if (img.isNew && img.file) {
          const uploaded = await uploadCategoryImage(
            savedCategory.id,
            img.file,
            img.altText,
            img.isPrimary
          );
          finalImages.push({
            id: uploaded.id,
            url: uploaded.url,
            publicId: uploaded.publicId,
            altText: img.altText,
            isPrimary: img.isPrimary,
            displayOrder: i
          });
        } else if (img.id) {
          // Update existing image if altText, primary status, or order changed
          const original = editingCategory?.images?.find(
            (o) => o.id === img.id
          );
          if (
            original &&
            (original.altText !== img.altText ||
              original.isPrimary !== img.isPrimary ||
              original.displayOrder !== i)
          ) {
            await updateCategoryImage(savedCategory.id, img.id, {
              altText: img.altText,
              isPrimary: img.isPrimary,
              displayOrder: i
            });
          }
          finalImages.push({ ...img, displayOrder: i });
        }
      }

      const primaryImg = finalImages.find((i) => i.isPrimary) || finalImages[0];

      const updatedStateCategory = {
        ...savedCategory,
        productCount: editingCategory ? editingCategory.productCount : 0,
        images: finalImages,
        imageUrl: primaryImg?.url ?? null,
        imagePublicId: primaryImg?.publicId ?? null
      };

      setCategories((prev) => {
        const exists = prev.some((item) => item.id === updatedStateCategory.id);
        if (exists) {
          return prev.map((item) =>
            item.id === updatedStateCategory.id ? updatedStateCategory : item
          );
        }
        return [updatedStateCategory, ...prev];
      });

      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to save category. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsLoading(true);
    try {
      await deleteAdminCategory(deletingCategory.id);
      setCategories((prev) =>
        prev.filter((item) => item.id !== deletingCategory.id)
      );
      setDeletingCategory(null);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete category.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3.5 sm:space-y-4 md:space-y-5 p-3.5 sm:p-5 md:p-6">
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

        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalFilteredCount={filteredCategories.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        editingCategory={editingCategory}
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCategory}
      />
      <DeleteConfirmModal
        isOpen={Boolean(deletingCategory)}
        category={deletingCategory}
        isLoading={isLoading}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
