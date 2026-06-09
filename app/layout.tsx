import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Denis Kipeles | Full-Stack Systems & Frontend Architect',
  description: 'Neobrutalist developer portfolio and high-frequency real-time terminal built with Next.js, Framer Motion, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
