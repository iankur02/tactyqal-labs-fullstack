import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CTA as CTA_CONTENT } from '@/constants/content';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function CTA() {
  return (
    <section id="contact" className="bg-surface-50 py-20 sm:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-xl2 bg-brand-950 px-6 py-14 text-center shadow-lift sm:px-12 sm:py-16"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-display text-white sm:text-4xl lg:text-5xl">
              {CTA_CONTENT.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{CTA_CONTENT.body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href={CTA_CONTENT.primary.href}
                className="!bg-white !text-brand-950 hover:!bg-white/90"
              >
                {CTA_CONTENT.primary.label} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                to={CTA_CONTENT.secondary.href}
                className="!border-white/20 !bg-transparent !text-white hover:!bg-white/10"
              >
                {CTA_CONTENT.secondary.label}
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}