/**
 * AemImage → maps to core/wcm/components/image (v3).
 *
 * Receives an `asset` object with:
 *   - dam:  path to the asset in the DAM (/content/dam/...). It's the source of truth
 *           you'll use when migrating; here it's just metadata/documentation.
 *   - src:  renderable URL in dev (local placeholder).
 *   - alt:  alternative text (required for accessibility and by the Image CC).
 *
 * When unpacking to AEM, this component becomes the Image Core Component,
 * `dam` feeds the fileReference and `alt` the dialog alt. `sizes`/`srcset`
 * are resolved by the DAM with renditions/Dynamic Media.
 */
export default function AemImage({ asset, sizes, className, loading = 'lazy' }) {
  if (!asset) return null;
  return (
    <img
      src={asset.src}
      alt={asset.alt || ''}
      data-dam-path={asset.dam}
      sizes={sizes}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
