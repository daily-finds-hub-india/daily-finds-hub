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

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  const sortOrder =
    params.sort === 'newest'
      ? [{ createdAt: 'desc' as const }]
      : params.sort === 'oldest'
        ? [{ createdAt: 'asc' as const }]
        : params.sort === 'price-low'
          ? [{ price: 'asc' as const }]
          : params.sort === 'price-high'
            ? [{ price: 'desc' as const }]
            : params.sort === 'rating'
              ? [{ rating: 'desc' as const }, { createdAt: 'desc' as const }]
              : params.sort === 'reviews'
                ? [
                    { reviewCount: 'desc' as const },
                    { createdAt: 'desc' as const }
                  ]
                : params.sort === 'trending'
                  ? [
                      { isTrending: 'desc' as const },
                      { createdAt: 'desc' as const }
                    ]
                  : [
                      { isFeatured: 'desc' as const },
                      { createdAt: 'desc' as const }
                    ];

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(params.category ? { categoryId: params.category } : {})
    },
    orderBy: sortOrder,
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
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
            <ProductGrid
              products={products}
              emptyMessage={
                params.category
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
