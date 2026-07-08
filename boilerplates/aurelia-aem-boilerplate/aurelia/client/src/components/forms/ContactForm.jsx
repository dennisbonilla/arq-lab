import { useState } from 'react';
import { useLocale } from '../../i18n/index.jsx';
import { submitContact } from '../../lib/api.js';
import { AemButton } from '../aem/index.js';

/**
 * ContactForm → AEM Forms (Adaptive Form or Core Form).
 *
 * AEM MAPPING:
 * - Each <input>/<select>/<textarea> = a form field. The `name`s match
 *   the server's Zod schema and what you would define in the form model.
 * - `topic` (select) maps to a Dropdown whose options come from a dictionary.
 * - The client-side validation here = the form rules; the server's is the
 *   source of truth (just as the AEM Forms submit action validates again).
 * - `company_website` is an anti-bot honeypot (hidden trap field).
 * - On submit: POST /api/contact -> Supabase (persistence) + Resend (email).
 */
const EMPTY = { name: '', email: '', phone: '', topic: 'bespoke', message: '', company_website: '' };

export default function ContactForm() {
  const { t, locale } = useLocale();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = t('contact.err.name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('contact.err.email');
    if (form.message.trim().length < 10) e.message = t('contact.err.message');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const { ok } = await submitContact({ ...form, locale });
    setStatus(ok ? 'ok' : 'error');
    if (ok) setForm(EMPTY);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot: invisible to humans, tempting for bots */}
      <div className="honeypot" aria-hidden="true">
        <label>Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={form.company_website}
            onChange={update}
          />
        </label>
      </div>

      <div className="field">
        <label htmlFor="name">{t('contact.field.name')}</label>
        <input id="name" name="name" value={form.name} onChange={update} required />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">{t('contact.field.email')}</label>
        <input id="email" type="email" name="email" value={form.email} onChange={update} required />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="phone">{t('contact.field.phone')}</label>
        <input id="phone" name="phone" value={form.phone} onChange={update} />
      </div>

      <div className="field">
        <label htmlFor="topic">{t('contact.field.topic')}</label>
        <select id="topic" name="topic" value={form.topic} onChange={update}>
          <option value="bespoke">{t('contact.topic.bespoke')}</option>
          <option value="appointment">{t('contact.topic.appointment')}</option>
          <option value="press">{t('contact.topic.press')}</option>
          <option value="other">{t('contact.topic.other')}</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">{t('contact.field.message')}</label>
        <textarea id="message" name="message" value={form.message} onChange={update} required />
        {errors.message && <span className="error">{errors.message}</span>}
      </div>

      <AemButton type="submit" onClick={undefined}>
        {status === 'sending' ? t('contact.sending') : t('contact.submit')}
      </AemButton>

      {status === 'ok' && <p className="form-note ok" style={{ marginTop: '1rem' }}>{t('contact.ok')}</p>}
      {status === 'error' && <p className="form-note err" style={{ marginTop: '1rem' }}>{t('contact.err')}</p>}
    </form>
  );
}
