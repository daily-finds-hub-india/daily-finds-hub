import { prisma } from '@/lib/prisma';

import { Categories } from '@/components/home/Categories';
import { DiscoveryCta } from '@/components/home/DiscoveryCta';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { TrendingProducts } from '@/components/home/TrendingProducts';

export default async function Home() {
  const [featuredProducts, trendingProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isPublished: true,
        isFeatured: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
      ,
      include: { images: { orderBy: { displayOrder: 'asc' } } }
    }),

    prisma.product.findMany({
      where: {
        isPublished: true,
        isTrending: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
      ,
      include: { images: { orderBy: { displayOrder: 'asc' } } }
    }),

    prisma.category.findMany({
      where: {
        isFeatured: true
      },
      orderBy: {
        name: 'asc'
      },
      take: 6
    })
  ]);

  return (
    <main>
      <Hero />

      <FeaturedProducts products={featuredProducts} />

      <Categories categories={categories} />

      <TrendingProducts products={trendingProducts} />

      <DiscoveryCta />
    </main>
  );
}
