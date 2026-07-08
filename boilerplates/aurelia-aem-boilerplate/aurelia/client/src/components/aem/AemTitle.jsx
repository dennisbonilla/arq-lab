/** AemTitle → core/wcm/components/title. `as` controla el nivel semantico. */
export default function AemTitle({ as: Tag = 'h2', children, className, id }) {
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}
