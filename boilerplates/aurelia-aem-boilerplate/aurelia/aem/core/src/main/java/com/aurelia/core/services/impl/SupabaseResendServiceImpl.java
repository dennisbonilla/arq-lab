package com.aurelia.core.services.impl;

import com.aurelia.core.services.ExternalCrmService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * Implementation that talks to Supabase (REST) and Resend (REST).
 * Reads credentials from the OSGi config; HTTP uses java.net.http.HttpClient.
 *
 * Left as a functional skeleton: adjust payloads/error handling as you see fit.
 */
@Component(service = ExternalCrmService.class, immediate = true)
@Designate(ocd = ExternalCrmConfig.class)
public class SupabaseResendServiceImpl implements ExternalCrmService {

    private ExternalCrmConfig config;
    private final HttpClient http = HttpClient.newHttpClient();

    @Activate
    protected void activate(ExternalCrmConfig config) {
        this.config = config;
    }

    @Override
    public void saveAndNotify(String name, String email, String phone,
                              String topic, String message, String locale) throws Exception {
        persistContact(name, email, phone, topic, message, locale);
        sendEmails(name, email, phone, topic, message, locale);
    }

    private void persistContact(String name, String email, String phone,
                                String topic, String message, String locale) throws Exception {
        if (isBlank(config.supabaseUrl()) || isBlank(config.supabaseServiceKey())) {
            return; // simulated mode if there are no credentials
        }
        String body = "{"
                + "\"name\":" + json(name) + ","
                + "\"email\":" + json(email) + ","
                + "\"phone\":" + json(phone) + ","
                + "\"topic\":" + json(topic) + ","
                + "\"message\":" + json(message) + ","
                + "\"locale\":" + json(locale) + ","
                + "\"source\":\"aem-contact-form\"}";
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(config.supabaseUrl() + "/rest/v1/contacts"))
                .header("apikey", config.supabaseServiceKey())
                .header("Authorization", "Bearer " + config.supabaseServiceKey())
                .header("Content-Type", "application/json")
                .header("Prefer", "return=minimal")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        http.send(req, HttpResponse.BodyHandlers.ofString());
    }

    private void sendEmails(String name, String email, String phone,
                            String topic, String message, String locale) throws Exception {
        if (isBlank(config.resendApiKey())) {
            return; // simulated mode
        }
        String subject = "es".equals(locale) ? "Nuevo contacto de " + name : "New contact from " + name;
        String text = "Name: " + name + "\\nEmail: " + email + "\\nPhone: " + phone
                + "\\nTopic: " + topic + "\\n\\n" + message;
        String payload = "{"
                + "\"from\":" + json(config.resendFrom()) + ","
                + "\"to\":[" + json(config.teamEmail()) + "],"
                + "\"subject\":" + json(subject) + ","
                + "\"text\":" + json(text) + "}";
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + config.resendApiKey())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();
        http.send(req, HttpResponse.BodyHandlers.ofString());
    }

    private static boolean isBlank(String s) { return s == null || s.isEmpty(); }
    private static String json(String s) {
        return "\"" + (s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"")) + "\"";
    }
}
