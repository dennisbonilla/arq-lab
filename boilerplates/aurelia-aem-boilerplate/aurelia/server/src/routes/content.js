import { Router } from 'express';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const router = Router();

/**
 * Serves Content Fragments as JSON, filtering by `locale`.
 *
 * AEM MAPPING:
 * In real AEM, this data are Content Fragments (models: "Piece" and "Article")
 * queried via the AEMaaCS persisted GraphQL endpoint, for example:
 *   GET /graphql/execute.json/aurelia/piecesByLocale;locale=es
 * The response shape stays identical so the client doesn't change.
 *
 * The locale fallback (es -> en) mimics the MSM/live copy behavior
 * when a translation hasn't been "rolled out" yet.
 */
async function loadFragment(name) {
  const raw = await readFile(join(DATA_DIR, `${name}.json`), 'utf-8');
  return JSON.parse(raw);
}

function localize(items, locale) {
  return items.map((item) => {
    const i18n = item.i18n || {};
    const fields = i18n[locale] || i18n.en || {};
    const { i18n: _drop, ...base } = item;
    return { ...base, ...fields, locale: i18n[locale] ? locale : 'en' };
  });
}

router.get('/gallery', async (req, res, next) => {
  try {
    const locale = String(req.query.locale || 'es');
    const { items } = await loadFragment('gallery');
    res.json({ model: 'piece', locale, items: localize(items, locale) });
  } catch (err) {
    next(err);
  }
});

router.get('/articles', async (req, res, next) => {
  try {
    const locale = String(req.query.locale || 'es');
    const { items } = await loadFragment('articles');
    res.json({ model: 'article', locale, items: localize(items, locale) });
  } catch (err) {
    next(err);
  }
});

router.get('/articles/:slug', async (req, res, next) => {
  try {
    const locale = String(req.query.locale || 'es');
    const { items } = await loadFragment('articles');
    const localized = localize(items, locale);
    const article = localized.find((a) => a.slug === req.params.slug);
    if (!article) return res.status(404).json({ error: 'not_found' });
    res.json({ model: 'article', locale, item: article });
  } catch (err) {
    next(err);
  }
});

export default router;
