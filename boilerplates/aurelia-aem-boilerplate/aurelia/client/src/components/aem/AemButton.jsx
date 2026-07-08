import { Link } from 'react-router-dom';

/**
 * AemButton → core/wcm/components/button.
 * If `to` is internal it uses <Link>; if external or `href`, an <a>.
 */
export default function AemButton({ to, href, variant = 'primary', children, onClick, type }) {
  const cls = `btn ${variant === 'ghost' ? 'btn--ghost' : ''}`.trim();
  if (to) return <Link className={cls} to={to}>{children}</Link>;
  if (href) return <a className={cls} href={href}>{children}</a>;
  return (
    <button className={cls} onClick={onClick} type={type || 'button'}>
      {children}
    </button>
  );
}
