import { useReducedMotion } from 'framer-motion';

/**
 * One source of truth for motion decisions across the app.
 * When the user prefers reduced motion, animations collapse to no-ops
 * so nothing moves, but layout and opacity are still sensible.
 */
export function useMotionSafe() {
  const reduce = useReducedMotion();

  const fadeUp = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  const hoverLift = reduce ? {} : { whileHover: { y: -4 } };

  const transition = reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return { reduce, fadeUp, hoverLift, transition };
}