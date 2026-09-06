export interface ProductImage {
  id?: string;
  url: string;
  publicId?: string;
  altText: string;
  displayOrder?: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;

  shortDescription: string;
  description: string;

  categoryId: string;

  price: number | string;
  originalPrice: number | string | null;

  rating: number | string | null;
  reviewCount: number;

  amazonUrl: string | null;
  asin: string | null;

  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;

  images: ProductImage[];
}
