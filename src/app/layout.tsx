import './globals.css';
import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

export const metadata: Metadata = { title: 'Bienvenue chez Karine-Beauté-Zen'};
export const viewport: Viewport = { themeColor: '#F2E9EB', width: 'device-width', initialScale: 1, viewportFit: 'cover', maximumScale: 1, userScalable: false};

export default function RootLayout({ children,}: { children: React.ReactNode;}) {
  return (
    <html lang="fr">
      <body className="antialiased text-black font-medium bg-[#F2E9EB] max-w-[1500px] mx-auto">
        <Providers>
          <Header/>
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
