'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import LocaleToggle from '@/app/components/ui/LocaleToggle';
import { useLocale } from '@/app/context/LocaleContext';

interface AppHeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
}

export default function AppHeader({ isAuthenticated, loading }: AppHeaderProps) {
  const { messages } = useLocale();
  const navigationLinks = [
    { label: messages.header.home, href: '#home' },
    { label: messages.header.features, href: '#features' },
    { label: messages.header.learners, href: '#audience' },
    { label: messages.header.story, href: '#story' },
    { label: messages.header.contact, href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-[#fdfaf2]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex h-18 w-60 items-center gap-3">
          <Image
            src="/images/logo/nova-logo.png"
            alt="Nova"
            width={240}
            height={75}
            style={{ objectFit: 'cover' }}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#556451] md:flex">
          {navigationLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#28412d]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle />
          {loading ? null : isAuthenticated ? (
            <Button asChild variant="solid" size="sm">
              <Link href="/profile">{messages.common.profile}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">{messages.common.login}</Link>
              </Button>
              <Button asChild variant="solid" size="sm">
                <Link href="/signup">{messages.common.signup}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
