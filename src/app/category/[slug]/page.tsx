import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { prisma } from '@/lib/prisma';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          _count: { select: { images: true } }
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Category"
            title={category.name}
            description={category.description ?? ''}
          />

          <div className="mt-14">
            <ProductGrid
              products={category.products}
              emptyMessage="We're still discovering finds for this category."
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
