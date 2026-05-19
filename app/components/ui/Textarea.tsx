import * as React from 'react';
import { cn } from '@/lib/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          'field-shell min-h-28 w-full rounded-[var(--radius-md)] px-4 py-3 text-sm leading-8 outline-none transition placeholder:text-[color:var(--color-text-soft)] disabled:cursor-not-allowed disabled:opacity-60',
          className
        )}
        {...props}
      />
    );
  }
);

export default Textarea;
