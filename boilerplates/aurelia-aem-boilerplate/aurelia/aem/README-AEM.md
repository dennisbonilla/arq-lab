# How to copy `aem/` into your AEM archetype

This folder **is not an AEM project that compiles on its own** (it has no `pom.xml`):
it is a set of artifacts **already translated** from the standalone front end and
**organized the same way as the archetype modules**, so that copying is just dragging
folder by folder.

> Convention used here: `appId = aurelia`, Java package = `com.aurelia`.
> **Rename them** to those of your real archetype (e.g. `myapp` / `com.mycompany.myapp`)
> with a find & replace before copying. Also adjust `/conf/aurelia` and `/content/dam/aurelia`.

## Copy map (source → destination in your archetype)

| Source in `aem/` | Destination in your archetype |
|---|---|
| `ui.apps/.../apps/aurelia/clientlibs/clientlib-site/` | `ui.apps/src/main/content/jcr_root/apps/<appId>/clientlibs/` |
| `ui.apps/.../apps/aurelia/components/helpers/*` (proxies) | `ui.apps/.../apps/<appId>/components/` |
| `ui.apps/.../apps/aurelia/components/page/` | `ui.apps/.../apps/<appId>/components/page/` |
| `ui.apps/.../apps/aurelia/components/piece-card/` | `ui.apps/.../apps/<appId>/components/` |
| `ui.apps/.../apps/aurelia/components/article-card/` | `ui.apps/.../apps/<appId>/components/` |
| `ui.apps/.../apps/aurelia/i18n/` | `ui.apps/.../apps/<appId>/i18n/` |
| `core/src/main/java/com/aurelia/core/*` | `core/src/main/java/<your package>/core/*` |
| `ui.config/.../apps/aurelia/osgiconfig/config/*.cfg.json` | `ui.config/.../apps/<appId>/osgiconfig/config/` |
| `ui.content/.../conf/aurelia/settings/dam/cfm/models/*` | Author the CF Models (see `_MODEL-SPEC.md`) |
| `ui.content/.../content/experience-fragments/*` | Author the XFs (see `_XF-GUIDE.md`) |
| `graphql/` | Configure endpoint + persisted queries (see `graphql/README.md`) |

## What is copied verbatim vs what is authored/adjusted

**Copy verbatim (low risk):**
- Clientlib (`global.css` is identical to the front end's; `modal.js` ports the logic of `PieceModal.jsx`).
- i18n dictionaries (`sling:MessageEntry`), keys identical to the front end's.
- Core Components proxies (Image/Title/Text/Button/Container).
- HTL + dialogs of `piece-card` and `article-card`.
- Sling Models, Servlet, Service and `.cfg.json`.

**Authored in the UI (Adobe recommends it; avoids fragile nodes):**
- **CF Models** `Piece` and `Article` → `_MODEL-SPEC.md` provides the exact fields and the
  sample values (taken from `server/src/data/*.json`).
- **Experience Fragments** Header/Footer/PromoBanner → `_XF-GUIDE.md`.
- **Editable templates** (one per page: Home, Collection, Journal, Contact).

## Dependencies your archetype must already have
- **WCM Core Components** (for the proxies and the core page). They are already referenced
  in the modern archetype's `all/pom.xml`.
- **Content Fragment API** (`com.adobe.cq.dam.cfm`) for the Sling Models — available
  in AEM 6.5 and AEMaaCS.
- `org.apache.sling.models.annotations` and the OSGi DS/metatype annotations
  (already in the archetype's `core/pom.xml`).

## Suggested order
1. Rename `aurelia`/`com.aurelia` to your appId/package.
2. Copy clientlib, i18n, proxies, page, `piece-card`, `article-card`.
3. Copy the `core/*` package (models, servlet, services).
4. Copy the `.cfg.json` to `ui.config` and set the secrets in Cloud Manager.
5. Author the 2 CF Models (`_MODEL-SPEC.md`) and create the instances in the DAM.
6. Author the XFs and the editable templates.
7. Configure the GraphQL endpoint + persisted queries.
8. Register `/bin/aurelia/contact` as allowed in the dispatcher.
9. `mvn clean install -PautoInstallSinglePackage` and test.

## Note about the modal
The card (`piece-card`) carries the data in `data-*` attributes; `modal.js` (in the
clientlib) listens for the click, builds the accessible dialog (Esc, backdrop, focus trap,
scroll lock) and injects it. No React: it's a site clientlib.
