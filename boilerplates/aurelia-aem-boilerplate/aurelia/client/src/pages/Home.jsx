import { useLocale } from '../i18n/index.jsx';
import { Container, AemImage, AemButton } from '../components/aem/index.js';
import PromoBanner from '../components/experiencefragments/PromoBanner.jsx';

/**
 * Home. Composed of blocks that are candidates for Experience Fragments:
 * Hero, Feature rows and PromoBanner. All the copy comes from i18n (dictionaries).
 */
export default function Home() {
  const { t } = useLocale();

  return (
    <>
      {/* HERO — candidate for the "home-hero" Experience Fragment */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <Container>
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 style={{ marginTop: '1.2rem' }}>
            {t('hero.title.a')} <em>{t('hero.title.em')}</em> {t('hero.title.b')}
          </h1>
          <p className="lede" style={{ marginTop: '1.4rem' }}>{t('hero.lede')}</p>
          <div className="hero-actions">
            <AemButton to="/gallery">{t('hero.cta.primary')}</AemButton>
            <AemButton to="/contact" variant="ghost">{t('hero.cta.secondary')}</AemButton>
          </div>
        </Container>
      </section>

      {/* FEATURE 1 */}
      <Container className="feature section">
        <div className="stack">
          <p className="eyebrow">{t('home.feature1.eyebrow')}</p>
          <h2>{t('home.feature1.title')}</h2>
          <p style={{ color: 'var(--stone)' }}>{t('home.feature1.body')}</p>
          <AemButton to="/stories" variant="ghost">{t('home.feature1.cta')}</AemButton>
        </div>
        <div className="media">
          <AemImage
            asset={{ dam: '/content/dam/aurelia/home/workshop.jpg', src: '/images/journal/setting.svg', alt: 'Jeweler working in the workshop' }}
          />
        </div>
      </Container>

      {/* FEATURE 2 (reversed order) */}
      <Container className="feature section">
        <div className="media">
          <AemImage
            asset={{ dam: '/content/dam/aurelia/home/gold.jpg', src: '/images/journal/gold.svg', alt: 'Gold in the workshop' }}
          />
        </div>
        <div className="stack">
          <p className="eyebrow">{t('home.feature2.eyebrow')}</p>
          <h2>{t('home.feature2.title')}</h2>
          <p style={{ color: 'var(--stone)' }}>{t('home.feature2.body')}</p>
          <AemButton to="/stories" variant="ghost">{t('home.feature2.cta')}</AemButton>
        </div>
      </Container>

      {/* PROMO — reusable Experience Fragment */}
      <PromoBanner />
    </>
  );
}
