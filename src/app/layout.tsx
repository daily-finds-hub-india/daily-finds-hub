import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Sans } from 'next/font/google';

import { NavigationScroll } from '@/components/layout/NavigationScroll';
import { SiteChrome } from '@/components/layout/SiteChrome';

import './globals.css';

const ibmPlex = IBM_Plex_Sans({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  display: 'swap'
});

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Daily Finds Hub',
    template: '%s | Daily Finds Hub'
  },
  description:
    'Discover useful gadgets, clever home products, kitchen finds, tech, travel essentials, and interesting products worth knowing about.',
  applicationName: 'Daily Finds Hub',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark'
};

const themeScript = `
(function () {
  try {
    var storageKey = 'daily-finds-theme';
    var storedTheme = localStorage.getItem(storageKey);

    var systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    var theme =
      storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : systemPrefersDark
          ? 'dark'
          : 'light';

    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    );
  } catch {
    // Fall back to the default light theme if storage is unavailable.
  }
})();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: themeScript
          }}
        />
      </head>

      <body className={`${ibmPlex.variable} ${archivo.variable}`}>
        <SiteChrome>{children}</SiteChrome>

        <NavigationScroll />
      </body>
    </html>
  );
}
