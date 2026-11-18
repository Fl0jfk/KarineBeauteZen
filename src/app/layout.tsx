import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Providers from './providers';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  getSiteData,
  toE164,
} from '@/lib/site';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Karine Beauté Zen — Institut de beauté à Saint-Pierre-des-Fleurs (27)',
    template: '%s | Karine Beauté Zen',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'institut de beauté',
    'Saint-Pierre-des-Fleurs',
    'Eure',
    'soin du visage',
    'massage',
    'manucure',
    'épilation',
    'extensions de cils',
    'carte cadeau beauté',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE_NAME,
    title: 'Karine Beauté Zen — Institut de beauté à Saint-Pierre-des-Fleurs',
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'Soins visage et corps chez Karine Beauté Zen' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karine Beauté Zen — Institut de beauté à Saint-Pierre-des-Fleurs',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: '#F7EEF1',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await getSiteData();
  const { profile } = data;

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: [DEFAULT_OG_IMAGE],
    logo: `${SITE_URL}/Logo2.png`,
    telephone: toE164(profile.telephone),
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: profile.adress,
      postalCode: profile.postalcode,
      addressLocality: profile.city,
      addressRegion: 'Normandie',
      addressCountry: 'FR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:00',
      },
    ],
    areaServed: profile.city,
    sameAs: SOCIAL_LINKS,
  };

  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased font-sans text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }}
        />
        <Providers initialData={data}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
