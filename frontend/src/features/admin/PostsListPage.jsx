import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdminPosts, deletePost, adminPostsQueryKey } from '@/api/adminPosts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate } from '@/utils/formatDate';
import { useDebounce } from '@/hooks/useDebounce';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/features/blog/components/ErrorState';
import EmptyState from '@/features/blog/components/EmptyState';
import Pagination from '@/features/blog/components/Pagination';
import { ConfirmDialog } from '@/components/ui/Modal';

const PAGE_SIZE = 10;

export default function PostsListPage() {
  useDocumentTitle('Posts');
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const status = params.get('status') || 'all';
  const search = params.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search → URL
  useEffect(() => {
  if (debouncedSearch === search) return;
  const next = new URLSearchParams(params);
  if (debouncedSearch) next.set('search', debouncedSearch);
  else next.delete('search');
  next.delete('page');
  setParams(next, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [debouncedSearch]);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const query = useQuery({
    queryKey: adminPostsQueryKey({ page, status, search }),
    queryFn: () => fetchAdminPosts({ page, limit: PAGE_SIZE, status, search: search || undefined }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      toast.success('Post deleted');
      qc.invalidateQueries({ queryKey: ['adminPosts'] });
      qc.invalidateQueries({ queryKey: ['adminStats'] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const posts = query.data?.data ?? [];
  const meta = query.data?.meta;

  const setStatus = (value) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete('status');
    else next.set('status', value);
    next.delete('page');
    setParams(next);
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-950 sm:text-3xl">Posts</h1>
          <p className="mt-1 text-sm text-brand-950/60">
            {meta ? `${meta.total} ${meta.total === 1 ? 'post' : 'posts'}` : 'Manage all blog posts.'}
          </p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-950/40" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-xl border border-brand-950/15 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-brand-950/15 bg-white p-1">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                status === s ? 'bg-brand-500 text-white' : 'text-brand-950/60 hover:bg-brand-950/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-brand-950/10 bg-white shadow-soft">
        {query.isLoading ? (
          <div className="p-14"><Spinner label="Loading posts…" /></div>
        ) : query.isError ? (
          <div className="p-6">
            <ErrorState
              title="Couldn’t load posts"
              description={query.error?.message}
              onRetry={() => query.refetch()}
            />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={search || status !== 'all' ? 'No posts match your filters' : 'No posts yet'}
              description={
                search || status !== 'all'
                  ? 'Try a different search term or status.'
                  : 'Create your first post to get started.'
              }
              action={
                <Link to="/admin/posts/new" className="btn-primary mt-6 text-sm">
                  <Plus className="h-4 w-4" /> New post
                </Link>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 text-xs uppercase tracking-wider text-brand-950/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-950/5">
                {posts.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-50/50">
                    <td className="max-w-[320px] px-5 py-3.5">
                      <Link
                        to={`/admin/posts/${p._id}/edit`}
                        className="block truncate font-medium text-brand-950 hover:text-brand-600"
                      >
                        {p.title}
                      </Link>
                      <p className="truncate text-xs text-brand-950/40">/{p.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-brand-950/70">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={p.status === 'published' ? 'published' : 'draft'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-brand-950/60">
                      {formatDate(p.updatedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        {p.status === 'published' ? (
                          <a
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-8 w-8 place-items-center rounded-lg text-brand-950/60 hover:bg-brand-950/5 hover:text-brand-600"
                            title="View live"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        ) : null}
                        <Link
                          to={`/admin/posts/${p._id}/edit`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-brand-950/60 hover:bg-brand-950/5 hover:text-brand-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-brand-950/60 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 ? (
        <div className="mt-6">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onChange={(next) => {
              const p = new URLSearchParams(params);
              p.set('page', next);
              setParams(p);
            }}
          />
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        busy={deleteMutation.isPending}
        title="Delete this post?"
        description={`“${deleteTarget?.title}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}