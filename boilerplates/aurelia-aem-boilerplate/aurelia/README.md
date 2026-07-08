# Aurelia — Front-end boilerplate for migrating to AEM

A **4-page** site (Node.js + React/Vite) for a **jewelry house**,
intentionally designed so that you later **unpack the HTML/JSX and create AEM components**,
making the most of AEM Sites capabilities.

- **Home** — hero + feature rows + promo banner (candidates for Experience Fragments).
- **Collection (Gallery)** — grid of pieces served as Content Fragments from the API.
- **Journal (Stories)** — editorial journal (list + detail) about craft and gems, with rich text.
- **Contact** — AEM Forms-style form → **Supabase** (contacts) + **Resend** (email).

> The theme (jewelry) exists only to provide real content. The architecture is what matters.

---

## Quick start

```bash
# 1) Install client and server dependencies
npm run install:all        # or: cd server && npm i  &&  cd ../client && npm i

# 2) Configure credentials (optional for development)
cp server/.env.example server/.env      # Supabase + Resend
cp client/.env.example client/.env      # optional

# 3) Start API (4000) + front end (5173) together
npm install                # installs 'concurrently' at the root
npm run dev
```

- Front end: http://localhost:5173  (Vite proxies `/api` → `http://localhost:4000`)
- API:       http://localhost:4000/api/health

**Without credentials**, the contact endpoint responds in *simulated mode*
(it neither persists nor sends email, but the flow works end to end).

---

## How it maps to AEM capabilities

All the detail is in [`docs/AEM-MAPPING.md`](docs/AEM-MAPPING.md). Summary:

| AEM capability           | Where it lives in the boilerplate                                        |
|--------------------------|--------------------------------------------------------------------------|
| **Core Components**      | `client/src/components/aem/` (Image, Title, Text, Button, Container)      |
| **Experience Fragments** | `client/src/components/experiencefragments/` (Header, Footer, PromoBanner)|
| **Content Fragments**    | `server/src/data/*.json` + `contentfragments/` (PieceCard, ArticleCard)   |
| **i18n / Dictionaries**  | `client/src/i18n/dictionaries/{es,en}.json` + `t()`                      |
| **MSM / Rollouts**       | `LocaleProvider` + per-locale `i18n` block in the fragments (EN fallback) |
| **DAM Images**           | `AemImage` with `data-dam-path` pointing to `/content/dam/...`            |
| **AEM Forms**            | `client/src/components/forms/ContactForm.jsx` + `server/routes/contact.js`|
| **External integration** | `server/src/lib/supabase.js`, `server/src/lib/resend.js`                 |

---

## Structure

```
aurelia/
├── server/                 # Node/Express API (ESM)
│   └── src/
│       ├── index.js
│       ├── routes/         # contact.js, content.js
│       ├── lib/            # supabase.js, resend.js
│       └── data/           # gallery.json (pieces), articles.json (journal)
├── client/                 # React + Vite
│   └── src/
│       ├── components/
│       │   ├── aem/                 # Core Components
│       │   ├── experiencefragments/ # Header, Footer, PromoBanner
│       │   ├── contentfragments/    # PieceCard, ArticleCard, SpecStrip
│       │   └── forms/               # ContactForm (AEM Forms)
│       ├── i18n/           # es/en dictionaries + provider (MSM/rollout)
│       ├── pages/          # Home, Gallery, Stories, StoryDetail, Contact
│       └── lib/            # api.js
├── supabase/schema.sql     # `contacts` table + RLS
└── docs/AEM-MAPPING.md     # component-by-component migration guide
```

---

## Migration notes

- Each component in `components/aem/` is designed as **1:1 with a Core Component**.
  When unpacking, you replace the JSX with HTL and the prop with the dialog value.
- The form field `name`s match the server's Zod schema, so you define the
  **AEM Forms form model** with the same names.
- The shape of the `/api/content/*` responses mimics what the AEMaaCS **Content Fragments
  GraphQL** endpoint returns, so the client doesn't change when migrating.
- The images' `data-dam-path` tells you exactly which **DAM** asset to use.

---

## The `aem/` folder — artifacts ready to copy into the archetype

In addition to the standalone project (`client/` + `server/`), this repo includes `aem/`:
the same blocks **already translated to AEM** and organized the same way as the archetype
modules (`ui.apps`, `ui.content`, `ui.config`, `core`), to copy folder by folder.

- **Copy verbatim:** clientlib (identical CSS + `modal.js`), i18n dictionaries
  (`sling:MessageEntry`), Core Components proxies, HTL + dialogs of `piece-card`
  and `article-card`, Sling Models, contact Servlet, Supabase/Resend Service and OSGi config.
- **Authored in the UI (with exact spec included):** CF Models `Piece`/`Article`
  (`_MODEL-SPEC.md`), Experience Fragments (`_XF-GUIDE.md`) and editable templates.
- **Persisted GraphQL:** replaces `server/routes/content.js` (see `aem/graphql/`).

Full copy guide in **[`aem/README-AEM.md`](aem/README-AEM.md)**.

> Important: `client/` (React/Vite) and `aem/` (HTL/JCR/Java) are different runtimes.
> The standalone runs with `npm run dev`; `aem/` is copied to the archetype and built with Maven.
> It's not the same tree running two ways: it's the real front end + its translation ready to paste.
