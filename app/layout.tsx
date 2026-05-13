import type { Metadata } from 'next';
import { AuthProvider } from './context/AuthContext';
import './globals.css'; // Make sure you have this file

export const metadata: Metadata = {
  title: 'Listening App',
  description: 'Learn English by listening and typing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
