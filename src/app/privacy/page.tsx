import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Daily Finds Hub India.'
};

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Daily Finds Hub India handles information when you use this website."
      />

      <Section>
        <Container>
          <article className="max-w-3xl space-y-12 text-base leading-8 text-[var(--text-secondary)]">
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Information we collect
              </h2>

              <p className="mt-4">
                We aim to keep data collection to a minimum. This website may
                collect information that you voluntarily provide, such as when
                you contact us by email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Analytics
              </h2>

              <p className="mt-4">
                We may use analytics tools in the future to understand how
                visitors use the website and improve the experience. Any such
                tools will be configured according to their applicable privacy
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Third-party websites
              </h2>

              <p className="mt-4">
                Our website may contain links to third-party websites, including
                online retailers. Once you leave Daily Finds Hub India, the
                privacy practices of that third party apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Changes to this policy
              </h2>

              <p className="mt-4">
                We may update this privacy policy as the website develops.
                Changes will be reflected on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                Contact
              </h2>

              <p className="mt-4">
                If you have questions about this policy, you can contact us at{' '}
                <a
                  href="mailto:dailyfindshubindia@gmail.com"
                  className="text-[var(--text-primary)] underline underline-offset-4 hover:text-[var(--accent)]"
                >
                  dailyfindshubindia@gmail.com
                </a>
                .
              </p>
            </section>
          </article>
        </Container>
      </Section>
    </main>
  );
}
