import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import es from './dictionaries/es.json';
import en from './dictionaries/en.json';

/**
 * i18n + locale/rollout context.
 *
 * AEM MAPPING:
 * - `dictionaries/*.json`  ->  AEM i18n dictionaries (/apps/aurelia/i18n) or
 *   Sling translation strings. The `t(key)` function is equivalent to the
 *   <fmt:message key="..."/> taglib from HTL/JSP.
 * - `locale`               ->  the language of the "language copy" in the
 *   MSM structure (e.g. /content/aurelia/es vs /content/aurelia/en). Changing
 *   locale here = navigating to another Live Copy in a rollout.
 * - A fragment without a translation falls back to EN, mimicking the state
 *   before a rollout.
 */
const DICTS = { es, en };
export const SUPPORTED_LOCALES = ['es', 'en'];

const LocaleContext = createContext(null);

export function LocaleProvider({ children, initialLocale = 'es' }) {
  const [locale, setLocale] = useState(
    SUPPORTED_LOCALES.includes(initialLocale) ? initialLocale : 'es'
  );

  const t = useCallback(
    (key, fallback) => {
      const dict = DICTS[locale] || DICTS.es;
      return dict[key] ?? DICTS.en[key] ?? fallback ?? key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a <LocaleProvider>');
  return ctx;
}
