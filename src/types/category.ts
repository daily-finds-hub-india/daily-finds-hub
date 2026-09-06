export interface CategoryImage {
  id?: string;
  url: string;
  publicId?: string;
  altText?: string;
  displayOrder?: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: CategoryImage[];
  isFeatured: boolean;
}
