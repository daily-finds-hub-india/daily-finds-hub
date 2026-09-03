import { Container } from '@/components/layout/Container';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { categories } from '@/data/categories';
import { products } from '@/data/products';
import type { ProductCategory } from '@/types/product';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({
  searchParams
}: ProductsPageProps) {
  const params = await searchParams;

  const category = params.category;
  const sort = params.sort ?? 'featured';

  let filteredProducts = [...products];

  if (category && categories.some((item) => item.id === category)) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === (category as ProductCategory)
    );
  }

  switch (sort) {
    case 'price-low':
      filteredProducts.sort(
        (a, b) => (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity)
      );
      break;

    case 'price-high':
      filteredProducts.sort(
        (a, b) =>
          (b.price?.amount ?? -Infinity) - (a.price?.amount ?? -Infinity)
      );
      break;

    case 'rating':
      filteredProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;

    case 'featured':
    default:
      filteredProducts.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="The collection"
            title="All finds."
            description="Browse useful gadgets, clever everyday products, and interesting things worth discovering."
          />

          <div className="mt-14">
            <ProductFilters />
            <ProductGrid products={filteredProducts} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
