const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };

export default function Spinner({ size = 'md', label = 'Loading', inline = false }) {
  const el = (
    <svg
      className={`${sizes[size]} animate-spin text-brand-500`}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={label}
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
  if (inline) return el;
  return <div className="flex items-center justify-center gap-2 text-sm text-brand-950/60">{el}{label ? <span>{label}</span> : null}</div>;
}