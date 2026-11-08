import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchPosts, postsQueryKey } from '@/api/posts';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import BlogCard from '@/features/blog/components/BlogCard';
import BlogSkeleton from '@/features/blog/components/BlogSkeleton';

export default function BlogPreview() {
  const query = useQuery({
    queryKey: postsQueryKey({ preview: true, limit: 3 }),
    queryFn: () => fetchPosts({ limit: 3, sort: 'newest' }),
    staleTime: 60_000,
  });

  const posts = query.data?.data ?? [];
  const showContent = !query.isLoading && !query.isError && posts.length > 0;

  return (
    <Section id="blog-preview" className="bg-surface-50">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="From the blog"
            title="Ideas, playbooks, and founder stories"
            align="left"
          />
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-600 hover:text-brand-500 sm:self-auto"
          >
            View all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          {query.isLoading ? (
            <BlogSkeleton count={3} />
          ) : query.isError ? (
            <div className="rounded-xl2 border border-dashed border-brand-950/15 bg-white p-10 text-center">
              <p className="text-sm text-brand-950/60">
                We couldn’t load the latest articles right now.{' '}
                <button
                  type="button"
                  onClick={() => query.refetch()}
                  className="font-semibold text-brand-600 hover:text-brand-500"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : !showContent ? (
            <div className="rounded-xl2 border border-dashed border-brand-950/15 bg-white p-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-500/10 text-brand-600">
                <Sparkles className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-brand-950">
                Fresh insights are on the way
              </h3>
              <p className="mt-2 text-sm text-brand-950/60">
                New articles will appear here as soon as they’re published.
              </p>
              <Link to="/blog" className="btn-secondary mt-6 text-sm">
                Visit the blog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard key={post._id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}