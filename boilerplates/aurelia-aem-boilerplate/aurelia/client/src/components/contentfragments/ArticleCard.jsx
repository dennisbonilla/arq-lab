import { Link } from 'react-router-dom';
import { AemImage } from '../aem/index.js';
import { useLocale } from '../../i18n/index.jsx';

/** ArticleCard: preview of an "Article" model Content Fragment. */
export default function ArticleCard({ article }) {
  const { t } = useLocale();
  return (
    <article className="article-card">
      <Link to={`/stories/${article.slug}`} className="media" aria-label={article.title}>
        <AemImage asset={article.hero} sizes="(max-width: 700px) 100vw, 33vw" />
      </Link>
      <span className="tag">{article.tag}</span>
      <h3><Link to={`/stories/${article.slug}`}>{article.title}</Link></h3>
      <p style={{ margin: 0, color: 'var(--stone)' }}>{article.excerpt}</p>
      <span className="meta">
        {t('stories.by')} {article.author} · {article.readMinutes} {t('stories.read')}
      </span>
    </article>
  );
}
