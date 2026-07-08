import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/index.jsx';
import { Container } from '../components/aem/index.js';
import PieceCard from '../components/contentfragments/PieceCard.jsx';
import PieceModal from '../components/contentfragments/PieceModal.jsx';
import { fetchGallery } from '../lib/api.js';

/**
 * Gallery. Reads Content Fragments of the "Piece" model by locale and shows
 * them in a compact grid. Clicking a card opens the detail in a modal.
 * When the language changes (MSM), it re-fetches the matching variant.
 */
export default function Gallery() {
  const { t, locale } = useLocale();
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let alive = true;
    setState('loading');
    fetchGallery(locale)
      .then((res) => { if (alive) { setItems(res.items); setState('ready'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [locale]);

  return (
    <Container className="section">
      <p className="eyebrow">{t('gallery.eyebrow')}</p>
      <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', margin: '1rem 0 0.6rem' }}>
        {t('gallery.title')}
      </h1>
      <p style={{ color: 'var(--stone)', maxWidth: '52ch', marginTop: 0 }}>{t('gallery.lede')}</p>

      {state === 'loading' && <p className="loading">Loading pieces…</p>}
      {state === 'error' && <p className="empty">The pieces could not be loaded.</p>}
      {state === 'ready' && (
        <div className="grid-pieces" style={{ marginTop: '2.5rem' }}>
          {items.map((p) => (
            <PieceCard key={p.id} piece={p} onOpen={setSelected} />
          ))}
        </div>
      )}

      {selected && <PieceModal piece={selected} onClose={() => setSelected(null)} />}
    </Container>
  );
}
