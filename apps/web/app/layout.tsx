import type { Metadata } from 'next';
import { Inter, Vazirmatn } from 'next/font/google';
import { AppProviders } from './providers';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-ui-fa',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui-en',
});

export const metadata: Metadata = {
  title: 'Nova | Listening Practice',
  description: 'Listening-first English practice for Iranian learners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} ${inter.variable} font-ui`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
