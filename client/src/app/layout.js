// src/app/layout.js

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/nprogress-custom.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import NProgressBar from '@/components/common/NProgressBar';
import CookieBanner from '@/components/common/CookieBanner';

// Load fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// ✅ SEO Metadata
export const metadata = {
  title: {
    default: 'EDIFICE',
    template: '%s | EDIFICE',
  },
  description:
    'EDIFICE is the benchmark of excellence in real estate and architecture, crafting visionary living spaces.',
  keywords: [
    'EDIFICE',
    'Architecture',
    'Real Estate',
    'Luxury Living',
    'Interior Design',
    'Modern Homes',
  ],
  authors: [{ name: 'EDIFICE Team', url: 'https://edificerealtybdopc.com' }],
  creator: 'EDIFICE',
  publisher: 'EDIFICE',
  metadataBase: new URL('https://edificerealtybdopc.com'),
  openGraph: {
    title: 'EDIFICE – Benchmark of Excellence',
    description:
      'Discover luxury architecture, innovative living, and design excellence with EDIFICE.',
    url: 'https://edificerealtybdopc.com',
    siteName: 'EDIFICE',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'EDIFICE Preview Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EDIFICE – Benchmark of Excellence',
    description: 'Explore modern living and visionary design with EDIFICE.',
    images: ['/og-image.jpg'], // Same image
    creator: '@edifice_official', // 🔁 Optional: update with your Twitter/X handle
  },
  icons: {
    icon: '/favicon.ico', // 🔁 Must be placed in /public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}
      >
        <NProgressBar />
        <Header />
        <main>{children}</main>
        <DarkModeToggle />
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
