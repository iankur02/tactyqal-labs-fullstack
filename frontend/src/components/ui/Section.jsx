export default function Section({ id, className = '', children, ...rest }) {
  return (
    <section id={id} className={`py-20 sm:py-24 lg:py-28 ${className}`} {...rest}>
      {children}
    </section>
  );
}