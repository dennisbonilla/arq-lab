import { useLocale } from '../../i18n/index.jsx';
import { AemButton } from '../aem/index.js';

/**
 * PromoBanner → reusable Experience Fragment (wholesale banner).
 * It's the classic XF use case: a promotional block authored once
 * and reused on several pages / even exported to external channels.
 */
export default function PromoBanner() {
  const { t } = useLocale();
  return (
    <section className="promo">
      <div className="wrap">
        <div>
          <h3>{t('home.promo.title')}</h3>
          <p style={{ margin: '0.3rem 0 0' }}>{t('home.promo.body')}</p>
        </div>
        <AemButton to="/contact" variant="ghost">{t('home.promo.cta')}</AemButton>
      </div>
    </section>
  );
}
