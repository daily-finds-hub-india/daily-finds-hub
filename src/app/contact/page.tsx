import { Mail, MessageCircle, Sparkles, HelpCircle, Clock } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Contact & Support',
  description:
    'Get in touch with Daily Finds Hub India for questions, recommendations, or brand collaborations.'
};

const faqs = [
  {
    q: 'Where do I purchase the products featured on your reels or shorts?',
    a: 'Every product on Daily Finds Hub includes a direct link to purchase on Amazon India. Just tap "View on Amazon" to visit the official listing with verified pricing and fast delivery.'
  },
  {
    q: 'Do you fulfill orders or handle shipping directly?',
    a: 'No. Daily Finds Hub is an editorial curation platform. All transactions, payments, deliveries, and returns are handled directly and securely through Amazon.in.'
  },
  {
    q: 'Can I submit a product or request a review?',
    a: 'Absolutely! If you make or discovered a smart tech gadget, home organizer, or kitchen find that deserves the spotlight, drop us an email or Instagram DM.'
  }
];

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Get in Touch"
        title="We'd Love to Hear From You"
        description="Questions about a featured product, partnership opportunities, or feedback on the hub? Connect with our team."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-5xl space-y-12">
            {/* Contact Channels Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Email Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xs transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Mail size={22} strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
                    General Inquiries
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    For questions, feedback, or general queries about our
                    catalog and website.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <a
                    href="mailto:dailyfindshubindia@gmail.com"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    dailyfindshubindia@gmail.com
                  </a>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Clock size={12} /> Replies within 24-48 hrs
                  </p>
                </div>
              </div>

              {/* Socials & DMs */}
              <div className="flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xs transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-primary)]">
                    <MessageCircle size={22} strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
                    Social & Reel DMs
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Saw a find on our Instagram Reels or YouTube Shorts? Mention
                    it in our comments or DMs.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
                    @dailyfindshubindia
                  </span>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Instagram & YouTube Community
                  </p>
                </div>
              </div>

              {/* Brand Collabs */}
              <div className="flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xs transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Sparkles size={22} strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">
                    Brand Partnerships
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Innovative consumer gadget, kitchenware, or lifestyle brand?
                    Let&apos;s feature your top products.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <a
                    href="mailto:dailyfindshubindia@gmail.com?subject=Brand%20Partnership%20Inquiry"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    Send Partnership Deck
                  </a>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Reviewed on genuine utility
                  </p>
                </div>
              </div>
            </div>

            {/* Quick FAQ Section */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <HelpCircle size={18} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="flex flex-col justify-start">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      {faq.q}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
