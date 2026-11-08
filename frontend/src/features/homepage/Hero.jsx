import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO } from '@/constants/content';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-50">
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <Container className="relative grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-600 shadow-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" /> {HERO.eyebrow}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="mt-6 text-4xl leading-[1.05] font-display sm:text-5xl lg:text-6xl"
          >
            {HERO.headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-xl text-base leading-relaxed text-brand-950/70 sm:text-lg"
          >
            {HERO.subhead}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button to={HERO.primaryCta.href} icon={ArrowRight}>
              {HERO.primaryCta.label}
            </Button>
            <Button variant="secondary" to={HERO.secondaryCta.href}>
              {HERO.secondaryCta.label}
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-brand-950/10 pt-8"
          >
            {HERO.proofPoints.map((point) => (
              <div key={point.label}>
                <dt className="text-xl font-semibold text-brand-950 sm:text-2xl">{point.value}</dt>
                <dd className="mt-1 text-xs text-brand-950/55 sm:text-sm">{point.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right-side visual: abstract product card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="rounded-xl2 border border-brand-950/10 bg-white p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-950/40">
                Founder roadmap
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                On track
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { week: 'Week 1', task: 'Idea validation workshop' },
                { week: 'Week 2', task: 'No-code MVP build' },
                { week: 'Week 3', task: 'Pitch & brand assets' },
                { week: 'Week 4', task: 'Product Hunt launch' },
              ].map((item, i) => (
                <div key={item.week} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500/10 text-xs font-semibold text-brand-600">
                    {i + 1}
                  </span>
                  <div className="flex-1 rounded-xl bg-surface-100 px-3 py-2.5">
                    <p className="text-[11px] font-medium text-brand-950/45">{item.week}</p>
                    <p className="text-sm font-medium text-brand-950">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-brand-950 p-4 text-white">
              <p className="text-xs text-white/60">Next milestone</p>
              <p className="mt-1 text-sm font-medium">Launch to 50 beta users</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}