import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client (server-side, uses the Service Role).
 *
 * In AEM, this file is the equivalent of an "OSGi service" / servlet that
 * talks to an external system. The `contacts` table is your external contacts
 * CRM; AEM Forms submits here and Supabase persists + triggers realtime, RLS, etc.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY on the client: it lives only on the server.
 */
let _client = null;

export function getSupabase() {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('[supabase] Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. ' +
      'The contact endpoint will respond in simulated mode.');
    return null;
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/** Inserts a lead/contact into the `contacts` table. Returns the created row. */
export async function saveContact(payload) {
  const supabase = getSupabase();
  if (!supabase) {
    // Simulated mode to develop without credentials.
    return { id: 'sim-' + Date.now(), simulated: true, ...payload };
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      topic: payload.topic,
      message: payload.message,
      locale: payload.locale ?? 'es',
      source: payload.source ?? 'web-contact-form',
    })
    .select()
    .single();

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }
  return data;
}
