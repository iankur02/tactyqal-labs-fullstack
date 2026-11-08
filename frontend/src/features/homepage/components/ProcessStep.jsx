import { motion } from 'framer-motion';

export default function ProcessStep({ step, index = 0 }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative flex gap-5 sm:gap-6"
    >
      <div className="flex flex-col items-center">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-950 text-sm font-semibold text-white">
          {step.number}
        </span>
        {index < 3 && <span className="mt-2 h-full w-px bg-brand-950/10" aria-hidden />}
      </div>
      <div className="pb-10">
        <h3 className="text-lg font-semibold text-brand-950">{step.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-950/60">{step.description}</p>
      </div>
    </motion.li>
  );
}