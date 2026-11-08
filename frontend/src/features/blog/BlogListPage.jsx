import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { fetchPosts, postsQueryKey } from '@/api/posts';
import { fetchCategories, categoriesQueryKey } from '@/api/categories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Container from '@/components/ui/Container';
import BlogCard from './components/BlogCard';
import BlogSearch from './components/BlogSearch';
import CategoryFilter from './components/CategoryFilter';
import Pagination from './components/Pagination';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import Seo from '@/components/Seo';
import Skeleton, { SkeletonText } from '@/components/ui/Skeleton';
import { useDebouncedSearchInput } from '@/hooks/useDebouncedSearchInput';
const PAGE_SIZE = 9;

export default function BlogListPage() {
    useDocumentTitle('Blog');

    const [params, setParams] = useSearchParams();
    const page = Math.max(1, Number(params.get('page')) || 1);
    const search = params.get('search') || '';
    const category = params.get('category') || '';

    const setParamsSafe = (patch, { resetPage = true, replace = false } = {}) => {
        const next = new URLSearchParams(params);
        Object.entries(patch).forEach(([k, v]) => {
            if (v === '' || v == null) next.delete(k);
            else next.set(k, String(v));
        });
        if (resetPage && !('page' in patch)) next.delete('page');
        setParams(next, { replace });
    };

    // Debounce search input â†’ URL (replace history to avoid spamming back-stack)
    const [searchInput, setSearchInput] = useDebouncedSearchInput(
        search,
        (value) => setParamsSafe({ search: value }, { replace: true })
    );

    const query = useQuery({
        queryKey: postsQueryKey({ page, search, category, limit: PAGE_SIZE }),
        queryFn: () =>
            fetchPosts({
                page,
                limit: PAGE_SIZE,
                search: search || undefined,
                category: category || undefined,
                sort: 'newest',
            }),
        keepPreviousData: true,
    });

    const categoriesQuery = useQuery({
        queryKey: categoriesQueryKey,
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
    });

    const posts = query.data?.data ?? [];
    const meta = query.data?.meta;
    const hasFilters = Boolean(search || category);

    const header = useMemo(() => {
        if (meta && meta.total > 0) {
            const noun = meta.total === 1 ? 'article' : 'articles';
            return `${meta.total} ${noun}${hasFilters ? ' matching your filters' : ''}`;
        }
        return null;
    }, [meta, hasFilters]);

    return (
        <>
            <Seo
                title="Blog"
                description="Practical guides, founder stories, and no-code playbooks for entrepreneurs building real products."
            />

            <div className="bg-surface-50">
                <Container className="py-14 sm:py-20">
                    <header className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
                            Insights
                        </p>
                        <h1 className="mt-3 font-display text-4xl leading-tight text-brand-950 sm:text-5xl">
                            Tactyqal Labs Blog
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-brand-950/65 sm:text-lg">
                            Practical guides, founder stories, and no-code playbooks — written for entrepreneurs turning ideas into products.
                        </p>
                    </header>

                    <div className="mt-10 flex flex-col gap-4 sm:mt-12">
                        <BlogSearch value={searchInput} onChange={setSearchInput} />
                        {categoriesQuery.data?.length ? (
                            <CategoryFilter
                                categories={categoriesQuery.data}
                                value={category}
                                onChange={(slug) => setParamsSafe({ category: slug })}
                            />
                        ) : null}
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-sm text-brand-950/55">
                            {query.isLoading ? 'Loading articlesâ€¦' : header || 'No articles yet'}
                        </p>
                        {hasFilters ? (
                            <button
                                type="button"
                                onClick={() => setParamsSafe({ search: '', category: '' }, { replace: false })}
                                className="text-sm font-semibold text-brand-600 hover:text-brand-500"
                            >
                                Clear filters
                            </button>
                        ) : null}
                    </div>

                    <div className="mt-6">
                        {query.isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
                                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                    <div key={i} className="overflow-hidden rounded-xl2 border border-brand-950/10 bg-white shadow-soft">
                                        <Skeleton className="aspect-[16/10] w-full rounded-none" />
                                        <div className="space-y-3 p-6">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <SkeletonText lines={2} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : query.isError ? (
                            <ErrorState
                                title="Couldnâ€™t load articles"
                                description={query.error?.message || 'Please try again in a moment.'}
                                onRetry={() => query.refetch()}
                            />
                        ) : posts.length === 0 ? (
                            <EmptyState
                                title={hasFilters ? 'No articles match your filters' : 'No articles published yet'}
                                description={
                                    hasFilters
                                        ? 'Try a different keyword or clear the category filter.'
                                        : 'The blog is just getting started. Check back soon or explore the homepage.'
                                }
                                action={
                                    hasFilters ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setParamsSafe({ search: '', category: '' }, { replace: false })
                                            }
                                            className="btn-primary mt-6 text-sm"
                                        >
                                            Clear filters
                                        </button>
                                    ) : null
                                }
                            />
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {posts.map((post, i) => (
                                        <BlogCard key={post._id} post={post} index={i} />
                                    ))}
                                </div>
                                <div className="mt-12 flex items-center justify-center">
                                    <Pagination
                                        page={meta?.page ?? 1}
                                        totalPages={meta?.totalPages ?? 1}
                                        onChange={(nextPage) => {
                                            setParamsSafe({ page: nextPage }, { resetPage: false });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {query.isFetching && !query.isLoading ? (
                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-brand-950/40">
                            <FileText className="h-3.5 w-3.5" /> Refreshingâ€¦
                        </div>
                    ) : null}
                </Container>
            </div>
        </>
    );
}

/**
 * Small hook that keeps a local input state in sync with the URL
 * and only propagates debounced changes upward.
 */

