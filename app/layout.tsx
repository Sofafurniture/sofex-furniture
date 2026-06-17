import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { BRAND_NAME } from '@/lib/brand';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Bespoke Custom Sofas`,
  description: 'Handcrafted bespoke sofas. Design your perfect sofa with our interactive configurator. Delivered in 4-6 weeks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
