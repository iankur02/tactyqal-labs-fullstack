import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow ? (
        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-display sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base text-brand-950/65 sm:text-lg">{description}</p>
      ) : null}
    </motion.div>
  );
}