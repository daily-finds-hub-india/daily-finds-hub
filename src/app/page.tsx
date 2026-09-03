import { Categories } from '@/components/home/Categories';
import { DiscoveryCta } from '@/components/home/DiscoveryCta';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { TrendingProducts } from '@/components/home/TrendingProducts';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <TrendingProducts />
      <DiscoveryCta />
    </main>
  );
}
