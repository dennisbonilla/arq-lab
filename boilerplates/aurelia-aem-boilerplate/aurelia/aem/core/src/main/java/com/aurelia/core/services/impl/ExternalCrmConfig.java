package com.aurelia.core.services.impl;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

/**
 * External credentials and endpoints. NEVER hardcoded: they are injected via
 * OSGi config (ui.config) or, in AEMaaCS, via Cloud Manager secret env vars.
 */
@ObjectClassDefinition(name = "Aurelia - External CRM (Supabase + Resend)")
public @interface ExternalCrmConfig {

    @AttributeDefinition(name = "Supabase URL")
    String supabaseUrl() default "";

    @AttributeDefinition(name = "Supabase Service Role Key", type = AttributeType.PASSWORD)
    String supabaseServiceKey() default "";

    @AttributeDefinition(name = "Resend API Key", type = AttributeType.PASSWORD)
    String resendApiKey() default "";

    @AttributeDefinition(name = "Resend From (verified sender)")
    String resendFrom() default "Aurelia <hola@tudominio.com>";

    @AttributeDefinition(name = "Team email (internal notification)")
    String teamEmail() default "equipo@tudominio.com";
}
