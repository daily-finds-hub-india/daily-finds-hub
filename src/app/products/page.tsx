import { Container } from '@/components/layout/Container';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { prisma } from '@/lib/prisma';
import { getPublicProductsList } from '@/lib/services/public-product';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

const VALID_SORTS = ['newest', 'oldest', 'name', 'price', 'rating'] as const;
type SortType = (typeof VALID_SORTS)[number];

export default async function ProductsPage({
  searchParams
}: ProductsPageProps) {
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    },
    select: {
      id: true,
      name: true
    }
  });

  const sortParam: SortType = VALID_SORTS.includes(params.sort as SortType)
    ? (params.sort as SortType)
    : 'newest';

  const productResult = await getPublicProductsList({
    categoryId: params.category,
    sort: sortParam,
    search: params.search
  });

  const products = productResult.items;

  const searchHeading = params.search
    ? `Finds for "${params.search}"`
    : 'All finds.';

  const searchEyebrow = params.search
    ? `Search results for "${params.search}"`
    : 'The collection';

  const description = params.search
    ? `Showing curated products matching "${params.search}".`
    : 'Browse useful gadgets, clever everyday products, and interesting things worth discovering.';

  const emptyMessage = params.search
    ? `No published products matched "${params.search}". Try a different keyword.`
    : params.category
      ? 'No published products match this category and sort.'
      : 'No published products are available yet.';

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow={searchEyebrow}
            title={searchHeading}
            description={description}
          />

          <div className="mt-8">
            <ProductFilters categories={categories} />
            <ProductGrid products={products} emptyMessage={emptyMessage} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
