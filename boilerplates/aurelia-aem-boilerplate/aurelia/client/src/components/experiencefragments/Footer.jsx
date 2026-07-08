import { Link } from 'react-router-dom';
import { useLocale } from '../../i18n/index.jsx';

/** Footer → Experience Fragment. Reusable across all pages. */
export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="brand" style={{ color: 'var(--paper)' }}>
            Aurelia<span>.</span>
          </div>
          <p style={{ maxWidth: '30ch', color: 'rgba(244,239,230,0.7)' }}>
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4>{t('footer.explore')}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
            <li><Link to="/gallery">{t('nav.gallery')}</Link></li>
            <li><Link to="/stories">{t('nav.stories')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4>{t('footer.company')}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
            <li><a href="mailto:hola@aurelia.example">hola@aurelia.example</a></li>
            <li>San José, Costa Rica</li>
          </ul>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: '2.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(244,239,230,0.5)' }}>
        © {year} Aurelia. {t('footer.rights')}
      </div>
    </footer>
  );
}
