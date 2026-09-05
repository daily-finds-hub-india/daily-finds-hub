import { Container } from '@/components/layout/Container';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { prisma } from '@/lib/prisma';
import { getPublicProducts } from '@/lib/queries/public';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({
  searchParams
}: ProductsPageProps) {
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  const products = await getPublicProducts({
    categoryId: params.category,
    sort: params.sort,
    search: params.search
  });

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow={params.search ? `Search results for "${params.search}"` : "The collection"}
            title={params.search ? `Finds for "${params.search}"` : "All finds."}
            description={
              params.search
                ? `Showing curated products matching "${params.search}".`
                : "Browse useful gadgets, clever everyday products, and interesting things worth discovering."
            }
          />

          <div className="mt-14">
            <ProductFilters categories={categories} />
            <ProductGrid
              products={products}
              emptyMessage={
                params.search
                  ? `No published products matched "${params.search}". Try a different keyword.`
                  : params.category
                    ? 'No published products match this category and sort.'
                    : 'No published products are available yet.'
              }
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
