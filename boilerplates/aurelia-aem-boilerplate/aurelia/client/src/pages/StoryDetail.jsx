import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../i18n/index.jsx';
import { Container, AemImage, AemText, AemTitle } from '../components/aem/index.js';
import { fetchArticle } from '../lib/api.js';

/**
 * StoryDetail: renders ONE full "Article" Content Fragment.
 * `body` is a multi-field (array of paragraphs) → AemText.
 * Demonstrates the "fragment detail" pattern typical of a blog in AEM.
 */
export default function StoryDetail() {
  const { slug } = useParams();
  const { t, locale } = useLocale();
  const [article, setArticle] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    fetchArticle(slug, locale)
      .then((res) => { if (alive) { setArticle(res.item); setState('ready'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [slug, locale]);

  return (
    <Container className="section">
      <Link to="/stories" className="back-link">← {t('stories.back')}</Link>

      {state === 'loading' && <p className="loading">Loading…</p>}
      {state === 'error' && <p className="empty">Story not found.</p>}
      {state === 'ready' && article && (
        <article className="article-detail">
          <p className="eyebrow" style={{ marginTop: '1.5rem' }}>{article.tag}</p>
          <AemTitle as="h1">{article.title}</AemTitle>
          <p className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--stone)' }}>
            {t('stories.by')} {article.author} · {article.readMinutes} {t('stories.read')} · {article.publishedAt}
          </p>
          <div className="hero-img">
            <AemImage asset={article.hero} loading="eager" />
          </div>
          <AemText value={article.body} />
        </article>
      )}
    </Container>
  );
}
