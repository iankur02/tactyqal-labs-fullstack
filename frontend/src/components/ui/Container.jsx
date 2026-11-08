export default function Container({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`container-x ${className}`}>{children}</Tag>;
}