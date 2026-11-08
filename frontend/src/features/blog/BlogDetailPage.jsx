import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowLeft,
    Calendar,
    Clock,
    ImageOff,
    User as UserIcon,
} from 'lucide-react';
import { fetchPostBySlug, fetchPosts, postQueryKey, postsQueryKey } from '@/api/posts';

import { formatDate } from '@/utils/formatDate';
import { readingTime } from '@/utils/readingTime';
import { resolveImageUrl } from '@/utils/images';
import { sanitizeHtml, hardenLinks } from '@/utils/sanitize';
import Container from '@/components/ui/Container';
import BlogCard from './components/BlogCard';
import ErrorState from './components/ErrorState';
import Seo from '@/components/Seo';
export default function BlogDetailPage() {
    const { slug } = useParams();
    const contentRef = useRef(null);

    const query = useQuery({
        queryKey: postQueryKey(slug),
        queryFn: () => fetchPostBySlug(slug),
        retry: false,
    });

    const post = query.data;


    // Fetch related posts once we know the current category
    const relatedQuery = useQuery({
        queryKey: postsQueryKey({ related: post?.category?.slug, limit: 4 }),
        queryFn: () => fetchPosts({ category: post.category.slug, limit: 4, sort: 'newest' }),
        enabled: Boolean(post?.category?.slug),
    });

    const related = (relatedQuery.data?.data ?? [])
        .filter((p) => p._id !== post?._id)
        .slice(0, 3);

    // Harden external links after render
    useEffect(() => {
        if (post && contentRef.current) hardenLinks(contentRef.current);
    }, [post]);

    if (query.isLoading) {
        return (
            <Container className="py-14 sm:py-20">
                <div className="mx-auto max-w-3xl space-y-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-surface-200" />
                    <div className="h-9 w-full animate-pulse rounded bg-surface-200" />
                    <div className="h-9 w-3/4 animate-pulse rounded bg-surface-200" />
                    <div className="aspect-[16/9] animate-pulse rounded-xl2 bg-surface-200" />
                </div>
            </Container>
        );
    }

    if (query.isError) {
        const notFound = query.error?.status === 404;
        return (
            <Container className="py-20">
                <div className="mx-auto max-w-2xl">
                    <ErrorState
                        title={notFound ? 'Article not found' : 'Couldnâ€™t load this article'}
                        description={
                            notFound
                                ? 'The link may be broken or the article may have been removed.'
                                : query.error?.message || 'Please try again in a moment.'
                        }
                        onRetry={notFound ? undefined : () => query.refetch()}
                    />
                    <div className="mt-6 text-center">
                        <Link to="/blog" className="btn-secondary text-sm">
                            <ArrowLeft className="h-4 w-4" /> Back to blog
                        </Link>
                    </div>
                </div>
            </Container>
        );
    }

    const image = resolveImageUrl(post.featuredImage?.url);
    const read = readingTime(post.content);

    return (
        <>
            <Seo
                title={post.seoTitle || post.title}
                description={post.seoDescription || post.excerpt}
                image={image || undefined}
                type="article"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: post.title,
                    description: post.seoDescription || post.excerpt,
                    image: image ? [image] : undefined,
                    datePublished: post.publishedAt,
                    dateModified: post.updatedAt,
                    author: post.author?.name
                        ? { '@type': 'Person', name: post.author.name }
                        : undefined,
                    publisher: {
                        '@type': 'Organization',
                        name: 'Tactyqal Labs',
                    },
                    mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : undefined,
                }}
            />


            <article className="bg-white">
                <Container className="py-14 sm:py-20">
                    <div className="mx-auto max-w-3xl">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-950/60 hover:text-brand-600"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to blog
                        </Link>

                        {post.category ? (
                            <Link
                                to={`/blog?category=${post.category.slug}`}
                                className="mt-6 inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 hover:bg-brand-500/15"
                            >
                                {post.category.name}
                            </Link>
                        ) : null}

                        <h1 className="mt-4 font-display text-3xl leading-tight text-brand-950 sm:text-4xl lg:text-5xl">
                            {post.title}
                        </h1>

                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-950/55">
                            {post.author?.name ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <UserIcon className="h-4 w-4" aria-hidden />
                                    {post.author.name}
                                </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" aria-hidden />
                                {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-4 w-4" aria-hidden />
                                {read.label}
                            </span>
                        </div>

                        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl2 bg-surface-100">
                            {image ? (
                                <img
                                    src={image}
                                    alt={post.title}
                                    className="h-full w-full object-cover"
                                    loading="eager"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/10 via-surface-100 to-accent-500/10 text-brand-950/30">
                                    <ImageOff className="h-10 w-10" aria-hidden />
                                </div>
                            )}
                        </div>

                        {post.excerpt ? (
                            <p className="mt-10 border-l-4 border-brand-500/40 pl-5 text-lg leading-relaxed text-brand-950/75">
                                {post.excerpt}
                            </p>
                        ) : null}

                        <div
                            ref={contentRef}
                            className="prose-tactyqal mt-8 max-w-none"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                        />

                        {post.tags?.length ? (
                            <div className="mt-10 flex flex-wrap gap-2 border-t border-brand-950/10 pt-6">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        to={`/blog?search=${encodeURIComponent(tag)}`}
                                        className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-brand-950/70 hover:bg-surface-200"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    {related.length > 0 ? (
                        <section className="mx-auto mt-20 max-w-5xl">
                            <h2 className="font-display text-2xl text-brand-950 sm:text-3xl">
                                Related articles
                            </h2>
                            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {related.map((p, i) => (
                                    <BlogCard key={p._id} post={p} index={i} />
                                ))}
                            </div>
                        </section>
                    ) : null}
                </Container>
            </article>
        </>
    );
}