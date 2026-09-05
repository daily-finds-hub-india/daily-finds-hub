import { notFound } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPublicCategoryBySlug } from '@/lib/queries/public';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await getPublicCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <Section>
        <Container>
          <Link
            href="/category"
            className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft
              size={14}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>All Categories</span>
          </Link>

          <SectionHeading
            eyebrow="Curated Category"
            title={category.name}
            description={category.description ?? 'Explore verified products and useful finds in this collection.'}
          />

          <div className="mt-12">
            <ProductGrid
              products={category.products}
              emptyMessage="We're currently discovering new finds for this category. Check back soon!"
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
