import type { Metadata } from 'next';
import Script from 'next/script';
import { DM_Sans } from 'next/font/google';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NavigationScroll } from '@/components/layout/NavigationScroll';
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

const themeScript = `
(function () {
  try {
    const storedTheme = localStorage.getItem("daily-finds-theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const theme =
      storedTheme || (systemPrefersDark ? "dark" : "light");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch {}
})();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className={dmSans.variable}>
        <Header />
        <NavigationScroll />
        {children}
        <Footer />
      </body>
    </html>
  );
}
