import { Container } from '@/components/layout/Container';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { prisma } from '@/lib/prisma';

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

  const [categories, selectedCategory] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    }),
    params.category
      ? prisma.category.findUnique({
          where: { id: params.category },
          select: { id: true }
        })
      : null
  ]);

  const sortOrder =
    params.sort === 'price-low'
      ? { price: 'asc' as const }
      : params.sort === 'price-high'
        ? { price: 'desc' as const }
        : params.sort === 'rating'
          ? { rating: 'desc' as const }
          : { isFeatured: 'desc' as const };

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(selectedCategory ? { categoryId: selectedCategory.id } : {})
    },
    orderBy: sortOrder,
    include: {
      _count: { select: { images: true } }
    }
  });

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
            <ProductFilters categories={categories} />
            <ProductGrid products={products} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
