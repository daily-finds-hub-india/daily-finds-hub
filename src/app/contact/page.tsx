import { Mail } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Daily Finds Hub India.'
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Get in touch"
        title="Have something to say?"
        description="Questions, suggestions, product tips, or just want to say hello? We'd love to hear from you."
      />

      <Section>
        <Container>
          <div className="max-w-2xl">
            <div className="border-[var(--border)]">
              <Mail
                size={22}
                strokeWidth={1.7}
                className="text-[var(--accent)]"
              />

              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Email us
              </h2>

              <p className="mt-3 max-w-lg text-base leading-7 text-[var(--text-secondary)]">
                For general questions, suggestions, collaborations, or feedback,
                send us an email.
              </p>

              <a
                href="mailto:dailyfindshubindia@gmail.com"
                className="mt-6 inline-flex text-sm font-medium text-[var(--text-primary)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                dailyfindshubindia@gmail.com
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
