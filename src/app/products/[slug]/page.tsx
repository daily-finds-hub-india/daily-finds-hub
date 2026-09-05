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

  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    categoryId: product.categoryId,
    price: product.price?.toString() ?? null,
    originalPrice: product.originalPrice?.toString() ?? null,
    rating: product.rating?.toString() ?? null,
    reviewCount: product.reviewCount,
    amazonUrl: product.amazonUrl,
    asin: product.asin,
    isFeatured: product.isFeatured,
    isTrending: product.isTrending,
    isPublished: product.isPublished,
    images: product.images
  };

  return (
    <main>
      <Section>
        <Container>
          <ProductDetails product={serializedProduct} />
        </Container>
      </Section>
    </main>
  );
}
