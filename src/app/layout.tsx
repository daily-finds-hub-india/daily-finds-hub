import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Daily Finds Hub India',
    template: '%s | Daily Finds Hub India'
  },
  description:
    'Discover useful gadgets, clever home products, kitchen finds, and interesting products worth knowing about.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.variable}>{children}</body>
    </html>
  );
}
