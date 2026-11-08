import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, BookOpen } from 'lucide-react';
import Seo from '@/components/Seo';
import Container from '@/components/ui/Container';
import { useMotionSafe } from '@/hooks/useMotionSafe';

export default function NotFoundPage() {
  const { fadeUp, transition } = useMotionSafe();

  return (
    <>
      <Seo title="Page not found" noIndex />
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <motion.div {...fadeUp} transition={transition} className="max-w-xl">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/10 text-brand-600">
            <Compass className="h-8 w-8" aria-hidden />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            Error 404
          </p>
          <h1 className="mt-3 font-display text-3xl text-brand-950 sm:text-4xl">
            We couldn’t find that page
          </h1>
          <p className="mt-4 text-base text-brand-950/60">
            The link may be broken, or the page may have moved. Let’s get you back on track.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary text-sm">
              <Home className="h-4 w-4" /> Back home
            </Link>
            <Link to="/blog" className="btn-secondary text-sm">
              <BookOpen className="h-4 w-4" /> Read the blog
            </Link>
          </div>
        </motion.div>
      </Container>
    </>
  );
}