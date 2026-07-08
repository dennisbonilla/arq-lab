import { NavLink } from 'react-router-dom';
import { useLocale, SUPPORTED_LOCALES } from '../../i18n/index.jsx';

/**
 * Header → Experience Fragment ("web" variation).
 * Combines brand, navigation (i18n) and the locale switch (MSM/rollout).
 * In AEM you author it once as an XF and reference it with the XF component
 * in each template, or mount it in the editable template's header.
 */
export default function Header() {
  const { t, locale, setLocale } = useLocale();

  const links = [
    { to: '/', key: 'nav.home', end: true },
    { to: '/gallery', key: 'nav.gallery' },
    { to: '/stories', key: 'nav.stories' },
    { to: '/contact', key: 'nav.contact' },
  ];

  return (
    <header className="site-header">
      <div className="wrap bar">
        <NavLink to="/" className="brand" aria-label="Aurelia">
          Aurelia<span>.</span>
        </NavLink>

        <nav className="nav" aria-label="Main">
          <span className="nav-links" style={{ display: 'contents' }}>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t(l.key)}
              </NavLink>
            ))}
          </span>

          <div className="locale-switch" aria-label="Language">
            {SUPPORTED_LOCALES.map((lc) => (
              <button
                key={lc}
                className={lc === locale ? 'active' : ''}
                onClick={() => setLocale(lc)}
                aria-pressed={lc === locale}
              >
                {lc.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
