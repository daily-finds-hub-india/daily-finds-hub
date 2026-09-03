import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { CategoryCard } from '@/components/home/CategoryCard';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isFeatured: boolean;
};

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const featuredCategories = categories.slice(0, 3);

  if (featuredCategories.length === 0) {
    return null;
  }

  return (
    <Section className="border-t border-[var(--border)]">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Explore"
            title="Find your kind of useful."
            description="Browse the things we look for most — from clever kitchen tools to everyday tech."
          />

          <Link
            href="/category"
            className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:self-auto"
          >
            View all categories
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
