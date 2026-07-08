# Experience Fragments (Header, Footer, PromoBanner)

In the standalone project these are: `client/src/components/experiencefragments/*`.
In AEM they are **authored** as Experience Fragments (not as code):

1. Go to **Experience Fragments → aurelia** and create 3 XFs: `site-header`, `site-footer`, `promo-banner`.
2. Drag the components inside (nav with i18n links, brand image, buttons).
3. Reference each XF from the editable template with the **Experience Fragment component**
   (or include them in the template's header/footer).

The header's language switch corresponds to navigating between Live Copies (MSM):
`/content/aurelia/es` ↔ `/content/aurelia/en`.

> Left as a guide (and not as .content.xml) because the JCR structure of an XF is
> better generated from the UI and exported; that way you avoid fragile nodes in the package.
