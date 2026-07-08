import { useLocale } from '../i18n/index.jsx';
import { Container } from '../components/aem/index.js';
import ContactForm from '../components/forms/ContactForm.jsx';

/** Contact: intro + AEM Forms. Layout a dos columnas. */
export default function Contact() {
  const { t } = useLocale();
  return (
    <Container className="section">
      <div className="form-shell">
        <div className="stack">
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>{t('contact.title')}</h1>
          <p style={{ color: 'var(--stone)', maxWidth: '40ch' }}>{t('contact.lede')}</p>
          <div className="spec-strip" style={{ marginTop: '1.5rem', borderColor: 'var(--line)' }}>
            <span>SUPABASE <b>contacts</b></span>
            <span>RESEND <b>2 emails</b></span>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
