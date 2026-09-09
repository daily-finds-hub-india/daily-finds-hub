import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { Container } from '@/components/layout/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPublicCategoriesList } from '@/lib/services/public-category';

export const metadata = {
  title: 'Categories',
  description:
    'Explore product categories and discover useful gadgets, clever products, and interesting everyday finds.'
};

export default async function CategoriesPage() {
  const categories = await getPublicCategoriesList();
  console.log(categories);
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
            <div className="mt-10 sm:mt-12">
              <CategoryGrid categories={categories} />
            </div>
          ) : (
            <div className="mt-10 sm:mt-12">
              <EmptyState
                eyebrow="Coming soon"
                title="Categories are being prepared."
                description="Check back soon as we curate new product areas."
              />
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
