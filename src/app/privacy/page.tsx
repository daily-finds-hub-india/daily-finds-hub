import { Shield, Eye, Database, ExternalLink, RefreshCw, Mail } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy and data protection practices for Daily Finds Hub India.'
};

const policySections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content:
      'We practice strict data minimization. Daily Finds Hub India does not require an account to browse. We do not collect names, phone numbers, or residential addresses unless you choose to contact us directly via email. Any email communications are used solely to reply to your inquiry.'
  },
  {
    icon: Eye,
    title: '2. Cookies & Anonymous Analytics',
    content:
      'We may utilize anonymous, privacy-conscious performance analytics to understand aggregate traffic patterns (such as popular categories and page loads). These do not collect personally identifiable information (PII) or track you across the broader internet.'
  },
  {
    icon: ExternalLink,
    title: '3. Affiliate & Third-Party Outbound Links',
    content:
      'Our website contains direct affiliate referral links to Amazon.in. When you click an outbound link, Amazon sets standard referral attribution cookies in order to process your session and attribute qualifying purchases. Please review Amazon.in’s Privacy Notice for their specific data handling policies.'
  },
  {
    icon: Shield,
    title: '4. Security & Data Protection',
    content:
      'We take standard industry precautions, including HTTPS encryption and continuous vulnerability protection, to safeguard any communication transmitted through our website.'
  },
  {
    icon: RefreshCw,
    title: '5. Updates to This Policy',
    content:
      'As we introduce new features or adapt to evolving legal standards, we may periodically update this policy. The date of the most recent revision is maintained at the bottom of this document.'
  }
];

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Legal & Privacy"
        title="Privacy Policy"
        description="We believe in respecting your privacy. Here is a clear, transparent breakdown of how data is handled on Daily Finds Hub India."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Policy Cards */}
            {policySections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--accent)]">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Questions / Contact Box */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-[var(--accent)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Questions about our privacy policy?
                </h3>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Feel free to email us directly at{' '}
                <a
                  href="mailto:dailyfindshubindia@gmail.com"
                  className="font-medium text-[var(--accent)] hover:underline"
                >
                  dailyfindshubindia@gmail.com
                </a>
                .
              </p>
              <p className="mt-4 text-xs text-[var(--text-muted)]">
                Last updated: September 2026
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
