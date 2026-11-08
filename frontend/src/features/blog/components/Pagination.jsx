import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-4"
    >
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-full border border-brand-950/15 bg-white px-4 py-2 text-sm font-medium text-brand-950/70 transition hover:border-brand-950/30 hover:text-brand-950 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden /> Prev
      </button>

      <span className="px-3 text-sm text-brand-950/60">
        Page <strong className="text-brand-950">{page}</strong> of {totalPages}
      </span>

      <button
        type="button"
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-full border border-brand-950/15 bg-white px-4 py-2 text-sm font-medium text-brand-950/70 transition hover:border-brand-950/30 hover:text-brand-950 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}