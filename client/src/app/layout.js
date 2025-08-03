// src/app/layout.js

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/nprogress-custom.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import NProgressBar from '@/components/common/NProgressBar';

// Load fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// ✅ Metadata for title, description, favicon
export const metadata = {
  title: 'EDIFICE',
  description: 'Benchmark of Excellence',
  icons: {
    icon: '/favicon.ico', // MUST exist in /public
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
      </body>
    </html>
  );
}
