package com.aurelia.core.services;

/**
 * ExternalCrmService — persists the contact (Supabase) and sends the emails (Resend).
 * Equivalent to lib/supabase.js + lib/resend.js from the standalone server.
 */
public interface ExternalCrmService {
    void saveAndNotify(String name, String email, String phone,
                       String topic, String message, String locale) throws Exception;
}
