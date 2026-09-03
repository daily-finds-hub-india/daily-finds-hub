import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Daily Finds Hub"
            title="Things worth discovering."
            description="Useful gadgets, clever home products, and interesting finds that make everyday life a little better."
          />

          <div className="flex flex-wrap items-center gap-5">
            <Button>Explore finds</Button>

            <Button variant="secondary">Browse categories</Button>

            <Button variant="text">About Daily Finds Hub →</Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
