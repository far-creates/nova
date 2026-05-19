'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'solid' | 'ghost' | 'outline' | 'soft' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  className?: string;
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {}

const variantStyles: Record<ButtonVariant, string> = {
  solid:
    'bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-[var(--shadow-soft)] hover:bg-[color:var(--color-primary-hover)]',
  ghost:
    'bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-accent-leaf)]/60',
  outline:
    'border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-primary)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elevated)]',
  soft: 'bg-[color:var(--color-accent-leaf)] text-[color:var(--color-primary)] hover:bg-[#d5e4c9]',
  danger:
    'bg-[color:var(--color-danger)] text-white shadow-[var(--shadow-soft)] hover:bg-[#99443d]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
  icon: 'h-12 w-12',
};

export default function Button({
  className = '',
  variant = 'solid',
  size = 'md',
  type = 'button',
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<{
      className?: string;
    }>;
    return React.cloneElement(child, {
      className: cn(child.props.className, classes),
    });
  }

  return (
    <button
      type={type}
      className={classes}
      {...props}
    />
  );
}
