import type { Metadata } from 'next';
import { AuthProvider } from './context/AuthContext';
import './globals.css';
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
});


export const metadata: Metadata = {
  title: 'Nova | مهارت شنیدن',
  description: 'یک پلتفرم گرم و مینیمال برای تقویت مهارت شنیدن و تمرین زبان',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
