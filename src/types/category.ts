export interface CategoryImageItem {
  id?: string;
  url: string;
  publicId: string;
  altText: string;
  isPrimary: boolean;
  displayOrder?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  isPublished: boolean;
  productCount: number;
  imageUrl: string | null;
  imagePublicId: string | null;
  images?: CategoryImageItem[];
  createdAt: string;
  updatedAt: string;
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
