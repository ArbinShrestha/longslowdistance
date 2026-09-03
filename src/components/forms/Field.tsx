import type { ReactNode } from 'react'

const inputClass =
  'w-full rounded-sm border border-line-strong bg-surface-2 px-4 py-3 text-ink placeholder:text-ink-subtle transition-colors duration-300 focus:border-ink focus:outline-none aria-[invalid=true]:border-bad'

export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-ink-subtle">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="text-sm text-bad" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextInput({ name, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; error?: string }) {
  return <input id={name} name={name} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined} className={inputClass} {...rest} />
}

export function Select({ name, error, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string; error?: string }) {
  return (
    <select id={name} name={name} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined} className={inputClass} {...rest}>
      {children}
    </select>
  )
}

export function Textarea({ name, error, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string; error?: string }) {
  return <textarea id={name} name={name} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined} className={`${inputClass} min-h-40`} {...rest} />
}

export function SubmitButton({ children, pending }: { children: ReactNode; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-ink transition-transform duration-500 ease-(--ease-soft) hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
    >
      {pending ? 'Sending' : children}
    </button>
  )
}
