export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number | null;
  rating: number | null;
  reviewCount: number;
  amazonUrl: string | null;
  asin: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  imageUrl: string | null;
  imagePublicId?: string | null;
  images?: ProductImageItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProductImageItem {
  id?: string;
  url: string;
  publicId?: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviewCount: string;
  amazonUrl: string;
  asin: string;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
}

export type CategoryFilter = 'all' | string;
export type StatusFilter = 'all' | 'published' | 'draft';
export type SpotlightFilter = 'all' | 'featured' | 'trending';
export type SortOption = 'newest' | 'oldest' | 'name' | 'price' | 'rating';
