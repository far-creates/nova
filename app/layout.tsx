import type { Metadata } from 'next';
import { AuthProvider } from './context/AuthContext';
import { LocaleProvider } from './context/LocaleContext';
import './globals.css';
import { Inter, Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-ui-fa',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui-en',
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
      <body className={`${vazirmatn.variable} ${inter.variable} font-ui`}>
        <LocaleProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
