import type { Metadata } from 'next';
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className={`${ibmPlex.variable} ${archivo.variable}`}>
        <SiteChrome>{children}</SiteChrome>
        <NavigationScroll />
      </body>
    </html>
  );
}
