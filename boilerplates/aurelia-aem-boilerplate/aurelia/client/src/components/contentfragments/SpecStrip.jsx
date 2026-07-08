import { useLocale } from '../../i18n/index.jsx';

/**
 * SpecStrip: the site's signature element (jeweler's hallmark). Shows the
 * "workshop" fields of a piece Content Fragment (metal, gem, carat, ref) as
 * a hallmark/stamp. Labels via i18n.
 */
export default function SpecStrip({ metal, gemstone, carat, reference }) {
  const { t } = useLocale();
  return (
    <div className="spec-strip">
      <span>{t('spec.metal')} <b>{metal}</b></span>
      <span>{t('spec.gemstone')} <b>{gemstone}</b></span>
      <span>{t('spec.carat')} <b className="score">{carat}</b></span>
      <span>{t('spec.ref')} <b>{reference}</b></span>
    </div>
  );
}
