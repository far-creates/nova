import * as React from 'react';
import { cn } from './cn';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export default function Field({
  label,
  helperText,
  error,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label ? (
        <label className="block text-sm font-semibold text-[color:var(--color-text)]">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-[color:var(--color-danger)]">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-[color:var(--color-text-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
}
