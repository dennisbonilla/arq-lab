/**
 * AemText → core/wcm/components/text (rich text).
 * Accepts a string or an array of paragraphs (as a multi-field CF returns).
 */
export default function AemText({ value, className }) {
  const paras = Array.isArray(value) ? value : [value];
  return (
    <div className={className}>
      {paras.filter(Boolean).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
