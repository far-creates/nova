'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/apps/web/context/AuthContext';
import { LocaleProvider } from '@/apps/web/context/LocaleContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>{children}</AuthProvider>
    </LocaleProvider>
  );
}
