import { Product, ProductFormData } from '@/types/product';

export const PAGE_SIZE = 8;

export const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'beauty', name: 'Beauty' }
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Mechanical Keyboard',
    slug: 'wireless-mechanical-keyboard',
    shortDescription: 'Compact mechanical keyboard with wireless connectivity.',
    description:
      'A compact wireless mechanical keyboard designed for everyday productivity and gaming.',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    price: 2499,
    originalPrice: 3499,
    rating: 4.5,
    reviewCount: 1284,
    amazonUrl: 'https://www.amazon.in/',
    asin: 'B000000001',
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    imageUrl: null,
    createdAt: '2026-09-01'
  },
  {
    id: '2',
    name: 'Minimal Desk Organizer',
    slug: 'minimal-desk-organizer',
    shortDescription:
      'Clean and compact organizer for your everyday desk setup.',
    description:
      'A minimal desk organizer for keeping stationery, accessories and small essentials arranged.',
    categoryId: 'home',
    categoryName: 'Home & Kitchen',
    price: 699,
    originalPrice: 999,
    rating: 4.3,
    reviewCount: 642,
    amazonUrl: 'https://www.amazon.in/',
    asin: 'B000000002',
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    imageUrl: null,
    createdAt: '2026-08-29'
  },
  {
    id: '3',
    name: 'Smart Fitness Bottle',
    slug: 'smart-fitness-bottle',
    shortDescription: 'Reusable insulated bottle built for active lifestyles.',
    description:
      'A durable insulated bottle suitable for workouts, travel and everyday hydration.',
    categoryId: 'fitness',
    categoryName: 'Fitness',
    price: 1199,
    originalPrice: 1599,
    rating: 4.1,
    reviewCount: 318,
    amazonUrl: null,
    asin: null,
    isFeatured: false,
    isTrending: false,
    isPublished: false,
    imageUrl: null,
    createdAt: '2026-08-27'
  }
];

export const emptyForm: ProductFormData = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  rating: '',
  reviewCount: '',
  amazonUrl: '',
  asin: '',
  isFeatured: false,
  isTrending: false,
  isPublished: false
};
