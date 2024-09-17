"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { DataProvider } from './contexts/data';
import { Viewport } from 'next';

const metaDetails: Record<string, { title: string; description: string }> = {
  '/': {
    title: '',
    description: '',
  },
  '/mentionslegales': {
    title: '',
    description: '',
  },
  '/contact': {
    title: 'Formulaire de contact KBZ',
    description: '',
  },
  '/boutique': {
    title: 'Boutique en ligne KBZ',
    description: '',
  },
  '/notreequipe': {
    title: 'Notre équipe !',
    description: '',
  },
  '/success': {
    title: 'Paiement validé !',
    description: '',
  },
  '/cancel': {
    title: 'Paiement échoué',
    description: '',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { title, description } = metaDetails[pathname] || {};
  useEffect(() => {
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = description;
      document.head.appendChild(newMetaDescription);
    }
  }, [pathname, title, description]);
  return (
    <html lang="fr">
      <body className={`antialiased text-black font-medium bg-[#F2E9EB]`}>
        <DataProvider>
          <Provider store={store}>
            <Header />
            {children}
            <Footer />
          </Provider>
        </DataProvider>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: '#F2E9EB',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  userScalable: false,
};

