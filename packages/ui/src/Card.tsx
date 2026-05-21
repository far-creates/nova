import * as React from 'react';
import { cn } from './cn';

type CardVariant = 'panel' | 'feature' | 'data';
type CardPadding = 'sm' | 'md' | 'lg';

const variantStyles: Record<CardVariant, string> = {
  panel: 'surface-panel rounded-[var(--radius-xl)]',
  feature:
    'surface-card rounded-[var(--radius-xl)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,247,237,0.96))]',
  data: 'surface-card rounded-[var(--radius-lg)]',
};

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

export default function Card({
  className,
  variant = 'panel',
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'text-[color:var(--color-text)]',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    />
  );
}
