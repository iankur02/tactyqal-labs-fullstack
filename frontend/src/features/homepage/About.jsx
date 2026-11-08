import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ABOUT } from '@/constants/content';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export default function About() {
  return (
    <Section id="about" className="bg-white">
      <Container>
        <SectionHeading eyebrow={ABOUT.eyebrow} title={ABOUT.heading} align="left" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="space-y-5 text-base leading-relaxed text-brand-950/70 sm:text-lg"
          >
            {ABOUT.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </motion.div>

          <div className="space-y-4">
            {ABOUT.pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex gap-4 rounded-xl2 border border-brand-950/10 bg-surface-50 p-5"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold text-brand-950">{pillar.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-950/60">{pillar.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}