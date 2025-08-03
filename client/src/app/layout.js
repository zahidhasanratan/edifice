'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import DarkModeToggle from '@/components/common/DarkModeToggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/assets/images/logo/logo.png"
          type="image/png"
        />
        <title>EDIFICE</title>
        <meta name="description" content="Benchmark of Excellence" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}
      >
        <Header />
        <main>{children}</main>
        <DarkModeToggle />
        <Footer />
      </body>
    </html>
  );
}
