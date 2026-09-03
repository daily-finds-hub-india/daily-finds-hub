export type ProductCategory =
  | 'kitchen'
  | 'home'
  | 'tech'
  | 'desk'
  | 'travel'
  | 'lifestyle';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;

  image: string;

  price?: {
    amount: number;
    currency: 'INR';
  };

  rating?: number;
  reviewCount?: number;

  featured?: boolean;
  trending?: boolean;

  amazonUrl?: string;
}
