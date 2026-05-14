'use client';

import * as React from 'react';

type ButtonVariant = 'solid' | 'ghost' | 'outline' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

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
    'bg-[#355c39] text-white shadow-[0_10px_24px_rgba(53,92,57,0.18)] hover:bg-[#2c4c30]',
  ghost: 'bg-transparent text-[#355c39] hover:bg-[#eef4ea]',
  outline:
    'border border-[#d9e2d4] bg-white text-[#355c39] hover:border-[#b8c9b0] hover:bg-[#fafcf7]',
  soft: 'bg-[#eef4ea] text-[#355c39] hover:bg-[#e3eddc]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
};

export default function Button({
  className = '',
  variant = 'solid',
  size = 'md',
  type = 'button',
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88a36f] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ');

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<{
      className?: string;
    }>;
    return React.cloneElement(child, {
      className: [child.props.className, classes].filter(Boolean).join(' '),
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
