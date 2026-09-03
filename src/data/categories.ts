import type { Category } from '@/types/category';

export const categories: Category[] = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Clever gadgets that make everyday cooking easier.',
    slug: 'kitchen',
    image: '/images/categories/kitchen.webp'
  },
  {
    id: 'home',
    name: 'Home',
    description: 'Useful finds that make your home a little better.',
    slug: 'home',
    image: '/images/categories/home.webp'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Interesting gadgets and everyday tech worth discovering.',
    slug: 'tech',
    image: '/images/categories/tech.webp'
  },
  {
    id: 'desk',
    name: 'Desk',
    description: 'Smart products for a better workspace.',
    slug: 'desk',
    image: '/images/categories/desk.webp'
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Useful gear for trips, journeys, and everyday carry.',
    slug: 'travel',
    image: '/images/categories/travel.webp'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Interesting products that fit into everyday life.',
    slug: 'lifestyle',
    image: '/images/categories/lifestyle.webp'
  }
];
