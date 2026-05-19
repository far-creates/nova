'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '@/app/context/LocaleContext';
import { signupWithLegacyAuth } from '@/packages/api/src/client';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Field from '@/app/components/ui/Field';
import Input from '@/app/components/ui/Input';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { messages } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await signupWithLegacyAuth({
        email,
        username,
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
              {messages.auth.signupTag}
            </p>
            <h2 className="text-3xl font-black text-[color:var(--color-text)]">
              {messages.auth.signupTitle}
            </h2>
            <p className="text-sm leading-7 text-[color:var(--color-text-muted)]">
              {messages.auth.signupDescription}
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

            <Field label={messages.auth.username}>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder={messages.auth.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>

            <Field label={messages.auth.password} helperText={messages.auth.passwordHelp}>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder={messages.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Field label={messages.auth.confirmPassword}>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder={messages.auth.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
          </div>

          <div className="space-y-4">
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? messages.auth.creatingAccount : messages.auth.createAccount}
            </Button>

            <p className="text-center text-sm text-[color:var(--color-text-muted)]">
              {messages.auth.hasAccount}{' '}
              <Link
                href="/login"
                className="font-medium text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)]"
              >
                {messages.auth.signin}
              </Link>
            </p>
          </div>
        </form>
        </Card>
      </div>
    </div>
  );
}
