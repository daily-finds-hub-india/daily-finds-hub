import {
  Clock3,
  HelpCircle,
  Mail,
  MessageCircle,
  Sparkles
} from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Contact & Support',
  description:
    'Get in touch with Daily Finds Hub for questions, feedback, product suggestions, or brand partnership opportunities.'
};

const faqs = [
  {
    question: 'Where can I buy the products featured on Daily Finds Hub?',
    answer:
      'When a product is available to purchase, its product page includes a link to its Amazon.in listing. Select “View on Amazon” to continue to the retailer.'
  },
  {
    question: 'Do you handle orders, payments, shipping, or returns?',
    answer:
      'No. Daily Finds Hub is a product discovery and curation platform. Purchases, payments, shipping, delivery, returns, and customer service are handled by the retailer.'
  },
  {
    question: 'Can I suggest a product or request a feature?',
    answer:
      'Absolutely. If you have discovered a genuinely useful gadget, home product, kitchen tool, or everyday find, send us an email or reach out through our social channels.'
  }
];

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Get in touch"
        title="Have a question? Let's talk."
        description="Whether you found something you love, have a product suggestion, or want to explore a partnership, we'd be happy to hear from you."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="group flex min-h-[18rem] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Mail size={21} strokeWidth={1.9} aria-hidden="true" />
                </div>

                <h2 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
                  General enquiries
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
                  Questions about a product, the website, or anything else
                  you&apos;d like to know? Send us an email.
                </p>

                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <a
                    href="mailto:dailyfindshubindia@gmail.com"
                    className="break-all text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    dailyfindshubindia@gmail.com
                  </a>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Clock3 size={12} aria-hidden="true" />
                    Usually within 24–48 hours
                  </p>
                </div>
              </div>

              <div className="group flex min-h-[18rem] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--text-primary)]">
                  <MessageCircle
                    size={21}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
                  Social & community
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
                  Saw one of our finds on social media? You can send us a DM or
                  mention the product in the comments.
                </p>

                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    @dailyfindshubindia
                  </span>

                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    Instagram & YouTube
                  </p>
                </div>
              </div>

              <div className="group flex min-h-[18rem] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Sparkles size={21} strokeWidth={1.9} aria-hidden="true" />
                </div>

                <h2 className="mt-6 text-lg font-bold text-[var(--text-primary)]">
                  Brand partnerships
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
                  Have a genuinely useful product or brand that fits what we
                  curate? We&apos;d love to hear what you&apos;re working on.
                </p>

                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <a
                    href="mailto:dailyfindshubindia@gmail.com?subject=Brand%20Partnership%20Inquiry"
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    Discuss a partnership
                  </a>

                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    Utility comes first
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs sm:p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <HelpCircle size={19} strokeWidth={1.9} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-text)]">
                    Quick answers
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                    Frequently asked questions
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {faqs.map((faq) => (
                  <article key={faq.question}>
                    <h3 className="text-sm font-semibold leading-5 text-[var(--text-primary)]">
                      {faq.question}
                    </h3>

                    <p className="mt-2.5 text-sm leading-6 text-[var(--text-secondary)]">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
