'use client';

import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export function FormField({ label, error, className = '', id, ...inputProps }: FormFieldProps) {
  const inputId = id ?? inputProps.name;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm text-zinc-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        className={`hyphai-focus w-full rounded-lg border bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:ring-1 ${
          error
            ? 'border-red-700 focus:border-red-600 focus:ring-red-600'
            : 'border-zinc-700 focus:border-emerald-600 focus:ring-emerald-600'
        } ${className}`}
        {...inputProps}
      />
      {error && (
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
