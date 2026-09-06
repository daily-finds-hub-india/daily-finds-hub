import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { Container } from '@/components/layout/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

import type { Category } from '@/types/category';

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const featuredCategories = categories.slice(0, 3);

  if (featuredCategories.length === 0) {
    return (
      <Section className="border-t border-[var(--border)]">
        <Container>
          <EmptyState
            eyebrow="Explore"
            title="No categories yet."
            description="Categories will appear here as the collection grows."
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="border-t border-[var(--border)]">
      <Container>
        <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Explore"
            title="Find your kind of useful."
            description="Browse the things we look for most — from clever kitchen tools to everyday tech."
          />

          <Link
            href="/categories"
            className="group inline-flex min-h-9 w-fit shrink-0 items-center gap-2 border-b border-[var(--border-strong)] pb-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span>View all</span>

            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12">
          <CategoryGrid
            categories={featuredCategories}
            className="lg:grid-cols-3"
          />
        </div>
      </Container>
    </Section>
  );
}
