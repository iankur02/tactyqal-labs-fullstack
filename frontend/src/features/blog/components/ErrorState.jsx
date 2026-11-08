import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Couldn’t load this page',
  description = 'Something went wrong while fetching content.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl2 border border-rose-200 bg-rose-50/60 px-6 py-16 text-center"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-brand-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-brand-950/60">{description}</p>
      {onRetry ? (
        <button onClick={onRetry} className="btn-secondary mt-6 text-sm">
          <RefreshCw className="h-4 w-4" aria-hidden /> Try again
        </button>
      ) : null}
    </div>
  );
}