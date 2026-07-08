import { Router } from 'express';
import { z } from 'zod';
import { saveContact } from '../lib/supabase.js';
import { sendContactEmails } from '../lib/resend.js';

const router = Router();

/**
 * Validation schema. The field names match 1:1 those of the client's
 * <ContactForm/> component so the migration to AEM Forms is
 * straightforward (each field = a form field with the same "name").
 */
const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal('')),
  topic: z.enum(['bespoke', 'appointment', 'press', 'other']),
  message: z.string().min(10).max(4000),
  locale: z.string().default('es'),
  // anti-spam honeypot: must arrive empty
  company_website: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;

    // Honeypot: if filled in, fake success and discard.
    if (data.company_website) return res.json({ ok: true });

    const contact = await saveContact(data);

    // We don't block the response if the email fails; log and move on.
    let email = { simulated: true };
    try {
      email = await sendContactEmails(data);
    } catch (mailErr) {
      console.error('[contact] email failed:', mailErr.message);
    }

    res.status(201).json({ ok: true, contactId: contact.id, email });
  } catch (err) {
    next(err);
  }
});

export default router;
