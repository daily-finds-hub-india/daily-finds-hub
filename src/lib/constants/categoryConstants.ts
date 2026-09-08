import { Category, CategoryFormData } from '@/types/category';

export const PAGE_SIZE = 8;

export const emptyForm: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  isFeatured: false,
  isPublished: false
};

export const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description:
      'Smart gadgets, accessories, computers, audio products and useful electronics.',
    productCount: 24,
    imageUrl: null,
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-09-01'
  },
  {
    id: '2',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description:
      'Useful products for home organization, cooking and everyday living.',
    productCount: 18,
    imageUrl: null,
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-08-29'
  },
  {
    id: '3',
    name: 'Fitness',
    slug: 'fitness',
    description:
      'Fitness equipment, workout accessories and products for active lifestyles.',
    productCount: 12,
    imageUrl: null,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-08-27'
  },
  {
    id: '4',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, footwear, accessories and everyday fashion finds.',
    productCount: 16,
    imageUrl: null,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-08-25'
  },
  {
    id: '5',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, grooming, personal care and beauty products.',
    productCount: 9,
    imageUrl: null,
    isFeatured: false,
    isPublished: false,
    createdAt: '2026-08-23'
  }
];
