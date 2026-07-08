/**
 * Container → core/wcm/components/container.
 * Wraps content with the site's max width and padding. In AEM it's the
 * layout container where authors drag components.
 */
export default function Container({ children, className = '', as: Tag = 'div' }) {
  return <Tag className={`wrap ${className}`.trim()}>{children}</Tag>;
}
