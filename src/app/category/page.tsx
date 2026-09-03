import { Container } from '@/components/layout/Container';
import { CategoryCard } from '@/components/home/CategoryCard';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { categories } from '@/data/categories';

export default function CategoriesPage() {
  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Browse the collection"
            title="Explore categories."
            description="Start with a category and discover useful gadgets, clever products, and interesting everyday finds."
          />

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
