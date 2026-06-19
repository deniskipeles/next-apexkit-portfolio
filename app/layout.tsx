import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define the dynamic metadata generator
export async function generateMetadata(): Promise<Metadata> {
  // 1. Define or fetch your dynamic URL (can come from an env variable, API, etc.)
  const faviconUrl = process.env.NEXT_PUBLIC_FAVICON_URL || '/favicon.png'; 
  
  // 2. Automatically determine the MIME type based on the file extension
  const extension = faviconUrl.split('.').pop();
  let mimeType = 'image/x-icon';
  
  if (extension === 'svg') {
    mimeType = 'image/svg+xml';
  } else if (extension === 'png') {
    mimeType = 'image/png';
  }

  return {
    title: 'Denis Kipeles | Full-Stack Systems & Frontend Architect',
    description: 'Neobrutalist developer portfolio and high-frequency real-time terminal built with Next.js, Framer Motion, and Tailwind CSS.',
    icons: [
      {
        rel: 'icon',
        type: mimeType,
        url: faviconUrl,
      },
    ],
  };
}

// Keep your RootLayout component the same
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