import { Resend } from 'resend';

/**
 * Transactional email sending with Resend.
 *
 * We send TWO emails per submission:
 *  1) internal notification to the team (new lead).
 *  2) auto-reply to the customer confirming receipt.
 *
 * In AEM this can live behind the AEM Forms "form submission action",
 * or as a Sling servlet. The email copy should come from the i18n/dictionary
 * to respect the rollout locale.
 */
let _resend = null;

function getResend() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

const COPY = {
  es: {
    subjectTeam: (name) => `Nuevo contacto de ${name}`,
    subjectUser: 'Recibimos tu mensaje — Aurelia',
    greeting: (name) => `Hola ${name},`,
    body: 'Gracias por escribirnos. Un miembro de nuestro taller te respondera dentro de 1-2 dias habiles.',
    signoff: 'Con aprecio,\nEl equipo de Aurelia',
  },
  en: {
    subjectTeam: (name) => `New contact from ${name}`,
    subjectUser: 'We received your message — Aurelia',
    greeting: (name) => `Hi ${name},`,
    body: 'Thanks for reaching out. A member of our workshop will reply within 1-2 business days.',
    signoff: 'Warmly,\nThe Aurelia team',
  },
};

export async function sendContactEmails(contact) {
  const resend = getResend();
  const locale = COPY[contact.locale] ? contact.locale : 'es';
  const t = COPY[locale];

  if (!resend) {
    console.warn('[resend] Missing RESEND_API_KEY. Emails not sent (simulated mode).');
    return { simulated: true };
  }

  const from = process.env.RESEND_FROM || 'Altura <hola@aurelia.example>';
  const teamTo = process.env.CONTACT_TEAM_EMAIL || 'equipo@aurelia.example';

  const [team, user] = await Promise.all([
    resend.emails.send({
      from,
      to: teamTo,
      subject: t.subjectTeam(contact.name),
      text:
        `Name: ${contact.name}\nEmail: ${contact.email}\n` +
        `Phone: ${contact.phone ?? '-'}\nTopic: ${contact.topic}\n` +
        `Locale: ${locale}\n\nMessage:\n${contact.message}`,
    }),
    resend.emails.send({
      from,
      to: contact.email,
      subject: t.subjectUser,
      text: `${t.greeting(contact.name)}\n\n${t.body}\n\n${t.signoff}`,
    }),
  ]);

  return { teamId: team.data?.id, userId: user.data?.id };
}
