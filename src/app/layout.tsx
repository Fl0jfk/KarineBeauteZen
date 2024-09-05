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
    title: '',
    description: '',
  },
  '/portfolio': {
    title: '',
    description: '',
  },
  '/about': {
    title: '',
    description: '',
  },
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
      <body className={`antialiased text-black font-medium`}>
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
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  userScalable: false,
};

