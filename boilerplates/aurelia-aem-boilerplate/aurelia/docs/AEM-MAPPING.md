# AEM migration guide (component by component)

This is your roadmap for "unpacking" the boilerplate into an AEM project.
Each section states: which React file to touch, what it becomes in AEM, and what to watch for.

---

## 1. Core Components — `client/src/components/aem/`

| React file      | AEM Core Component               | When migrating                                                  |
|-----------------|----------------------------------|-----------------------------------------------------------------|
| `AemImage.jsx`  | `core/wcm/components/image/v3`   | `data-dam-path` → `fileReference`; `alt` → dialog alt; renditions/`srcset` come from the DAM or Dynamic Media. |
| `AemTitle.jsx`  | `core/wcm/components/title/v3`   | prop `as` → `type` (h1–h6 level).                              |
| `AemText.jsx`   | `core/wcm/components/text/v2`    | accepts an array of paragraphs = multi-paragraph RTE of a CF.  |
| `AemButton.jsx` | `core/wcm/components/button/v2`  | `to`/`href` → `link`; `children` → `text`.                    |
| `Container.jsx` | `core/wcm/components/container`  | layout wrapper; in AEM it's the editable layout container.      |

**Rule:** don't put business logic here. They are presentational primitives.

---

## 2. Experience Fragments — `client/src/components/experiencefragments/`

- `Header.jsx`, `Footer.jsx` → **Experience Fragments** referenced from the
  editable template (or the header/footer of the page policy).
- `PromoBanner.jsx` → reusable XF ("bespoke pieces and appointments"); the classic
  "author once, reuse on many pages" use case, and you can even export it to external channels.
- The Header's **locale switch** represents navigating between Live Copies of an
  MSM rollout (e.g. `/content/aurelia/es` ↔ `/content/aurelia/en`).

---

## 3. Content Fragments — `server/src/data/*.json` + `contentfragments/`

The JSON files are the **mock of two Content Fragment Models**:

### `Piece` model (`gallery.json`)
Fields: `name`, `collection`, `notes`, `metal`, `gemstone` (localized) +
`carat`, `ref`, `image` (DAM reference).
→ Render: `PieceCard.jsx` + `SpecStrip.jsx` (the "hallmark": metal · gem · carat · ref).

### `Article` model (`articles.json`)
Fields: `title`, `excerpt`, `author`, `tag`, `body[]` (multi-paragraph rich text),
`hero` (DAM), `readMinutes`, `publishedAt`, `slug`.
→ Render: `ArticleCard.jsx` (list) and `StoryDetail.jsx` (detail).

**When migrating:** create the two CF Models in AEM, publish the fragments, and replace
the `lib/api.js` calls with **persisted GraphQL** queries, e.g.:

```
GET /graphql/execute.json/aurelia/piecesByLocale;locale=es
GET /graphql/execute.json/aurelia/articleBySlug;slug=las-4c-de-un-diamante;locale=es
```

The current JSON shape is designed to match the GraphQL response, so the React
component barely changes.

---

## 4. i18n / Dictionaries + MSM/Rollouts

- `client/src/i18n/dictionaries/{es,en}.json` → **AEM i18n dictionaries**
  (`/apps/aurelia/i18n`). The `t(key)` function is equivalent to `<fmt:message key=".."/>`.
- `LocaleProvider` (`i18n/index.jsx`) models the language of the **language copy** within
  the MSM structure.
- **Rollout fallback:** if a fragment doesn't have the requested locale, the server
  falls back to `en` (see `localize()` in `content.js`). This mimics the state of a Live
  Copy before the translation rollout runs.

---

## 5. DAM

- `AemImage` never hardcodes binaries: it receives `{ dam, src, alt }`.
  - `dam` = canonical path in the DAM you'll use in AEM (`/content/dam/aurelia/...`).
  - `src` = only the local placeholder for dev.
- When migrating, upload the real assets to the DAM at those paths and the `fileReference`
  is ready.

---

## 6. AEM Forms — `forms/ContactForm.jsx` + `server/routes/contact.js`

- Each field (`name`, `email`, `phone`, `topic`, `message`) = a **form field**.
  The `name`s match the server's **Zod schema** → use them identically in
  the AEM form model.
- `topic` is a dropdown whose options (`bespoke`, `appointment`, `press`, `other`)
  come from the dictionary (i18n).
- **Double validation:** client (UX) + server (source of truth), just as the AEM Forms
  submit action revalidates.
- **Honeypot** `company_website`: hidden anti-bot trap field.
- **Submit action** (`POST /api/contact`):
  1. validates,
  2. persists to **Supabase** (`saveContact`),
  3. triggers **Resend** (`sendContactEmails`): team notification + auto-reply.

In AEM, you replace the `fetch` with the Adaptive Form submit pointing to a
Sling servlet that calls the same services (Supabase/Resend) or to AEM Forms
Data Integration.

---

## Suggested migration checklist

1. [ ] Create CF Models `Piece` and `Article`; load fragments.
2. [ ] Define persisted GraphQL queries and change `lib/api.js`.
3. [ ] Upload assets to the DAM at the `data-dam-path` paths.
4. [ ] Port `aem/*` to HTL using Core Components.
5. [ ] Convert Header/Footer/PromoBanner into Experience Fragments.
6. [ ] Load dictionaries into `/apps/aurelia/i18n`.
7. [ ] Set up the MSM structure (blueprint + live copies per language) and test the rollout.
8. [ ] Recreate the form in AEM Forms and connect the submit to Supabase/Resend.
