import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500 transition',
};

export default function Button({
  variant = 'primary',
  to,
  href,
  children,
  className = '',
  icon: Icon,
  ...rest
}) {
  const classes = `${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
    </>
  );

  if (to) {
    return (
      <motion.div whileTap={{ scale: 0.97 }}>
        <Link to={to} className={classes} {...rest}>
          {content}
        </Link>
      </motion.div>
    );
  }
  if (href) {
    return (
      <motion.a whileTap={{ scale: 0.97 }} href={href} className={classes} {...rest}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button whileTap={{ scale: 0.97 }} className={classes} {...rest}>
      {content}
    </motion.button>
  );
}