import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

export default function ServiceCard({ service, index = 0 }) {
  const Icon = Icons[service.icon] || Icons.Sparkles;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col rounded-xl2 border border-brand-950/10 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-brand-950">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-950/60">{service.description}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
        Learn more <ArrowUpRight className="h-4 w-4" />
      </span>
    </motion.article>
  );
}