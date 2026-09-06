import { getPublicCategories, getPublicProducts } from '@/lib/queries/public';

import { CategoriesSection } from '@/components/home/CategoriesSection';
import { DiscoveryCta } from '@/components/home/DiscoveryCta';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { Hero } from '@/components/home/Hero';
import { TrendingSection } from '@/components/home/TrendingSection';

export default async function Home() {
  const [featuredProducts, trendingProducts, categories] = await Promise.all([
    getPublicProducts({
      sort: 'featured',
      take: 6
    }),

    getPublicProducts({
      sort: 'trending',
      take: 6
    }),

    getPublicCategories({
      featured: true,
      take: 6
    })
  ]);

  return (
    <main>
      <Hero />

      <FeaturedSection products={featuredProducts} />

      <CategoriesSection categories={categories} />

      <TrendingSection products={trendingProducts} />

      <DiscoveryCta />
    </main>
  );
}
