import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { categories } from '@/data/categories';
import { products } from '@/data/products';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === category.id
  );

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Category"
            title={category.name}
            description={category.description}
          />

          <div className="mt-14">
            <ProductGrid
              products={categoryProducts}
              emptyMessage="We're still discovering finds for this category."
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
