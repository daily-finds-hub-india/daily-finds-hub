import { CategoryCard } from '@/components/home/CategoryCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { prisma } from '@/lib/prisma';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      images: { orderBy: { displayOrder: 'asc' } }
    }
  });

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Browse by interest"
            title="Explore categories."
            description="Start with a category and discover useful gadgets, clever products, and interesting everyday finds."
          />

          {categories.length > 0 ? (
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="mt-14">
              <p className="border-t border-[var(--border)] py-16 text-sm text-[var(--text-secondary)]">
                Categories are being prepared. Check back soon.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
