import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No articles found',
  description = 'Try a different search term or clear your filters.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-brand-950/15 bg-white px-6 py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-500/10 text-brand-600">
        <BookOpen className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-brand-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-brand-950/60">{description}</p>
      {action ?? (
        <Link to="/" className="btn-secondary mt-6 text-sm">
          Back to homepage
        </Link>
      )}
    </div>
  );
}