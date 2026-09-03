import type { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'dummy-001',
    slug: 'mini-electric-chopper',
    name: 'Mini Electric Chopper',
    description:
      'A compact kitchen helper for chopping vegetables, herbs, and everyday ingredients.',
    category: 'kitchen',
    image: '/images/products/mini-electric-chopper.webp',
    price: {
      amount: 899,
      currency: 'INR'
    },
    rating: 4.3,
    reviewCount: 2847,
    featured: true,
    trending: true
  },
  {
    id: 'dummy-002',
    slug: '2-in-1-food-bag-sealer',
    name: '2-in-1 Food Bag Sealer',
    description:
      'Seal and cut opened food packets to keep everyday snacks and ingredients fresh.',
    category: 'kitchen',
    image: '/images/products/food-bag-sealer.webp',
    price: {
      amount: 599,
      currency: 'INR'
    },
    rating: 4.2,
    reviewCount: 1632,
    featured: true
  },
  {
    id: 'dummy-003',
    slug: 'digital-kitchen-timer',
    name: 'Digital Kitchen Timer',
    description:
      'A simple countdown timer for cooking, baking, study sessions, and everyday tasks.',
    category: 'kitchen',
    image: '/images/products/digital-kitchen-timer.webp',
    price: {
      amount: 399,
      currency: 'INR'
    },
    rating: 4.4,
    reviewCount: 918,
    featured: true,
    trending: true
  },
  {
    id: 'dummy-004',
    slug: 'rechargeable-electric-lighter',
    name: 'Rechargeable Electric Lighter',
    description:
      'A flameless rechargeable lighter designed for convenient everyday kitchen use.',
    category: 'home',
    image: '/images/products/electric-lighter.webp',
    price: {
      amount: 499,
      currency: 'INR'
    },
    rating: 4.1,
    reviewCount: 1254,
    trending: true
  },
  {
    id: 'dummy-005',
    slug: 'digital-kitchen-scale',
    name: 'Digital Kitchen Scale',
    description:
      'A compact precision scale for weighing ingredients while cooking and baking.',
    category: 'kitchen',
    image: '/images/products/kitchen-scale.webp',
    price: {
      amount: 699,
      currency: 'INR'
    },
    rating: 4.5,
    reviewCount: 3210
  }
];
