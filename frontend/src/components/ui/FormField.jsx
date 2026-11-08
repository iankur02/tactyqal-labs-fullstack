import { forwardRef } from 'react';

const baseField =
  'w-full rounded-xl border border-brand-950/15 bg-white px-3.5 py-2.5 text-sm text-brand-950 shadow-sm outline-none transition placeholder:text-brand-950/35 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-surface-100 disabled:text-brand-950/50';

const errorRing = 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20';

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-950/60">
      {children}
      {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
    </label>
  );
}

function Hint({ children, id, tone = 'muted' }) {
  const cls = tone === 'error' ? 'text-rose-600' : 'text-brand-950/50';
  return <p id={id} className={`mt-1.5 text-xs ${cls}`}>{children}</p>;
}

export const Input = forwardRef(function Input(
  { label, id, error, hint, required, className = '', ...rest },
  ref
) {
  const inputId = id || rest.name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div>
      {label ? <Label htmlFor={inputId} required={required}>{label}</Label> : null}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${baseField} ${error ? errorRing : ''} ${className}`}
        {...rest}
      />
      {error ? <Hint tone="error" id={`${inputId}-error`}>{error}</Hint> : hint ? <Hint id={`${inputId}-hint`}>{hint}</Hint> : null}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, id, error, hint, required, rows = 4, className = '', ...rest },
  ref
) {
  const inputId = id || rest.name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div>
      {label ? <Label htmlFor={inputId} required={required}>{label}</Label> : null}
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${baseField} resize-y ${error ? errorRing : ''} ${className}`}
        {...rest}
      />
      {error ? <Hint tone="error" id={`${inputId}-error`}>{error}</Hint> : hint ? <Hint id={`${inputId}-hint`}>{hint}</Hint> : null}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, id, error, hint, required, options = [], placeholder, className = '', ...rest },
  ref
) {
  const inputId = id || rest.name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div>
      {label ? <Label htmlFor={inputId} required={required}>{label}</Label> : null}
      <select
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${baseField} pr-8 ${error ? errorRing : ''} ${className}`}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error ? <Hint tone="error" id={`${inputId}-error`}>{error}</Hint> : hint ? <Hint id={`${inputId}-hint`}>{hint}</Hint> : null}
    </div>
  );
});