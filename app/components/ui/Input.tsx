import * as React from 'react';
import { cn } from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const inputClasses =
  'field-shell h-12 w-full rounded-[var(--radius-md)] px-4 text-sm outline-none transition placeholder:text-[color:var(--color-text-soft)] disabled:cursor-not-allowed disabled:opacity-60';

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return <input ref={ref} className={cn(inputClasses, className)} {...props} />;
});

export default Input;
