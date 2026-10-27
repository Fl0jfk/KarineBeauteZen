import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Providers from './providers';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Karine Beauté Zen — Institut de beauté à Saint-Pierre-des-Fleurs',
  description:
    'Soins visage et corps, massages, manucure, épilation et cartes cadeaux à Saint-Pierre-des-Fleurs.',
};

export const viewport: Viewport = {
  themeColor: '#F7EEF1',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased font-sans text-ink">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
