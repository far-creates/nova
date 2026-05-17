// !!! Correct {import { navigationLinks } from '../landing/landingData';}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import { navigationLinks } from '../landing/landingData';

interface HeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
}

export default function Header({ isAuthenticated, loading }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-[#fdfaf2]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex items-center gap-3 w-60 h-18">
          <Image
            src="/images/logo/nova-logo.png"
            alt="Nova"
            width={240}
            height={75}
            style={{
                objectFit: 'cover',
                }}
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
          {loading ? null : isAuthenticated ? (
            <Button asChild variant="solid" size="sm">
              <Link href="/profile">پروفایل</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">ورود</Link>
              </Button>
              <Button asChild variant="solid" size="sm">
                <Link href="/signup">ثبت‌نام</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
