export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export type StatusFilter = 'all' | 'published' | 'draft';
export type SpotlightFilter = 'all' | 'featured';
export type SortOption = 'newest' | 'oldest' | 'name' | 'products';
