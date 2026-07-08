import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/index.jsx';
import { Container } from '../components/aem/index.js';
import ArticleCard from '../components/contentfragments/ArticleCard.jsx';
import { fetchArticles } from '../lib/api.js';

/** Stories: list of "Article" model Content Fragments by locale. */
export default function Stories() {
  const { t, locale } = useLocale();
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    fetchArticles(locale)
      .then((res) => { if (alive) { setItems(res.items); setState('ready'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [locale]);

  return (
    <Container className="section">
      <p className="eyebrow">{t('stories.eyebrow')}</p>
      <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', margin: '1rem 0 0.6rem' }}>
        {t('stories.title')}
      </h1>
      <p style={{ color: 'var(--stone)', maxWidth: '52ch', marginTop: 0 }}>{t('stories.lede')}</p>

      {state === 'loading' && <p className="loading">Loading stories…</p>}
      {state === 'error' && <p className="empty">The stories could not be loaded.</p>}
      {state === 'ready' && (
        <div className="grid-articles" style={{ marginTop: '2.5rem' }}>
          {items.map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
      )}
    </Container>
  );
}
