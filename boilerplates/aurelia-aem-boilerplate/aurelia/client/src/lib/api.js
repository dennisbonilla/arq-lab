/**
 * Minimal HTTP client to the Aurelia API.
 * In AEM, these calls are replaced by the Content Fragments GraphQL
 * endpoint (reads) and by the AEM Forms submit action (writes).
 */
const BASE = import.meta.env.VITE_API_BASE || '';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

export function fetchGallery(locale) {
  return get(`/api/content/gallery?locale=${encodeURIComponent(locale)}`);
}
export function fetchArticles(locale) {
  return get(`/api/content/articles?locale=${encodeURIComponent(locale)}`);
}
export function fetchArticle(slug, locale) {
  return get(`/api/content/articles/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
}

export async function submitContact(payload) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
