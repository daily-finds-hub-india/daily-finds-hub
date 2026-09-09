// src/app/page.tsx
import { getPublicProductsList } from '@/lib/services/public-product';
import { getPublicCategoriesList } from '@/lib/services/public-category';

import { CategoriesSection } from '@/components/home/CategoriesSection';
import { DiscoveryCta } from '@/components/home/DiscoveryCta';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { Hero } from '@/components/home/Hero';
import { TrendingSection } from '@/components/home/TrendingSection';

export default async function Home() {
  const [featuredResult, trendingResult, categories] = await Promise.all([
    getPublicProductsList({
      featured: true,
      pageSize: 6
    }),

    getPublicProductsList({
      trending: true,
      pageSize: 6
    }),

    getPublicCategoriesList()
  ]);

  // Filter or slice categories if your UI expects a limited featured set
  const featuredCategories = categories
    .filter((cat) => cat.isFeatured)
    .slice(0, 6);

  return (
    <main>
      <Hero />

      <FeaturedSection products={featuredResult.items} />

      <CategoriesSection categories={featuredCategories} />

      <TrendingSection products={trendingResult.items} />

      <DiscoveryCta />
    </main>
  );
}
