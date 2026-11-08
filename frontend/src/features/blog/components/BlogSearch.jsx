import { Search, X } from 'lucide-react';

export default function BlogSearch({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-md">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-950/40"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles…"
        aria-label="Search articles"
        className="w-full rounded-full border border-brand-950/15 bg-white py-2.5 pl-11 pr-11 text-sm text-brand-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-950/40 hover:bg-brand-950/5 hover:text-brand-950"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}