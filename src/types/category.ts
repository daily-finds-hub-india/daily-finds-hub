import type { ProductCategory } from './product';

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  slug: string;
  image: string;
}
