import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, CheckCircle2, FileEdit, FolderTree, Plus, ArrowRight } from 'lucide-react';
import { fetchStats, statsQueryKey } from '@/api/adminPosts';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate } from '@/utils/formatDate';
import StatCard from './components/StatCard';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/features/blog/components/ErrorState';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: statsQueryKey,
    queryFn: fetchStats,
  });

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-950 sm:text-3xl">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-brand-950/60">Here’s an overview of your blog.</p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {isError ? (
        <div className="mt-8">
          <ErrorState
            title="Couldn’t load stats"
            description={error?.message}
            onRetry={() => refetch()}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total posts" value={data?.total ?? 0} icon={FileText} loading={isLoading} />
            <StatCard label="Published" value={data?.published ?? 0} icon={CheckCircle2} tone="emerald" loading={isLoading} />
            <StatCard label="Drafts" value={data?.draft ?? 0} icon={FileEdit} tone="amber" loading={isLoading} />
            <StatCard label="Categories" value={data?.categories ?? 0} icon={FolderTree} tone="purple" loading={isLoading} />
          </div>

          <div className="mt-8 rounded-xl2 border border-brand-950/10 bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-brand-950/10 px-5 py-4">
              <h2 className="text-sm font-semibold text-brand-950">Recently updated</h2>
              <Link
                to="/admin/posts"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {isLoading ? (
              <div className="p-10"><Spinner label="Loading posts…" /></div>
            ) : (data?.recent?.length ?? 0) === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-brand-950/60">No posts yet.</p>
                <Link to="/admin/posts/new" className="btn-secondary mt-4 text-sm">
                  Create your first post
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-brand-950/5">
                {data.recent.map((p) => (
                  <li key={p._id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/admin/posts/${p._id}/edit`}
                        className="block truncate text-sm font-medium text-brand-950 hover:text-brand-600"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-brand-950/50">
                        {p.category?.name || 'Uncategorised'} · updated {formatDate(p.updatedAt)}
                      </p>
                    </div>
                    <Badge tone={p.status === 'published' ? 'published' : 'draft'}>
                      {p.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}