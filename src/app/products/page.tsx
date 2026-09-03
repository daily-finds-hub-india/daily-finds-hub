import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { products } from '@/data/products';

export default function ProductsPage() {
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
            <ProductGrid products={products} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
