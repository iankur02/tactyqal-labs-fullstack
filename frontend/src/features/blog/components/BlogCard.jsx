import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ImageOff } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { readingTime } from '@/utils/readingTime';
import { resolveImageUrl } from '@/utils/images';

export default function BlogCard({ post, index = 0 }) {
  const image = resolveImageUrl(post.featuredImage?.url);
  const read = readingTime(post.excerpt || '');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl2 border border-brand-950/10 bg-white shadow-soft transition-shadow hover:shadow-lift"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-100"
        aria-label={post.title}
      >
        {image ? (
          <img
            src={image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/10 via-surface-100 to-accent-500/10 text-brand-950/30">
            <ImageOff className="h-8 w-8" aria-hidden />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {post.category ? (
          <span className="mb-3 inline-flex w-fit rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
            {post.category.name}
          </span>
        ) : null}

        <h3 className="text-lg font-semibold leading-snug text-brand-950">
          <Link to={`/blog/${post.slug}`} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-950/60">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-4 pt-5 text-xs text-brand-950/50">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {read.label}
          </span>
        </div>
      </div>
    </motion.article>
  );
}