import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { ProductDetails } from '@/components/products/ProductDetails';
import { Section } from '@/components/ui/Section';
import { getPublicProductBySlug } from '@/lib/queries/public';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Section>
        <Container>
          <ProductDetails product={product} />
        </Container>
      </Section>
    </main>
  );
}
