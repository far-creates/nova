'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '@/app/context/LocaleContext';
import { loginWithLegacyAuth } from '@/packages/api/src/client';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Field from '@/app/components/ui/Field';
import Input from '@/app/components/ui/Input';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { messages } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginWithLegacyAuth({
        email,
        password,
      });

      // Update auth context with user data
      setUser(data.user);

      // Redirect to landing page
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <Card variant="feature" padding="lg" className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="font-ui-en text-xs uppercase tracking-[0.22em] text-[color:var(--color-accent-solar)]">
              {messages.auth.loginTag}
            </p>
            <h2 className="text-3xl font-black text-[color:var(--color-text)]">
              {messages.auth.loginTitle}
            </h2>
            <p className="text-sm leading-7 text-[color:var(--color-text-muted)]">
              {messages.auth.loginDescription}
            </p>
          </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/10 p-4">
              <p className="text-sm text-[color:var(--color-danger)]">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Field label={messages.auth.email}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={messages.auth.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label={messages.auth.password}>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder={messages.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </div>

          <div className="space-y-4">
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? messages.auth.signingIn : messages.auth.signin}
            </Button>

            <p className="text-center text-sm text-[color:var(--color-text-muted)]">
              {messages.auth.noAccount}{' '}
              <Link
                href="/signup"
                className="font-medium text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)]"
              >
                {messages.auth.createAccount}
              </Link>
            </p>
          </div>
        </form>
        </Card>
      </div>
    </div>
  );
}
