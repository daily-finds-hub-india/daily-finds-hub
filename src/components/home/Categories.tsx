import { Container } from '@/components/layout/Container';
import { CategoryCard } from '@/components/home/CategoryCard';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import { categories } from '@/data/categories';

export function Categories() {
  return (
    <Section className="border-t border-[var(--border)]">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Find your kind of useful."
          description="Browse the things we look for most — from clever kitchen tools to everyday tech."
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
