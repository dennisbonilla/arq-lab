package com.aurelia.core.servlets;

import com.aurelia.core.services.ExternalCrmService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;

/**
 * ContactServlet — form submit action (AEM Forms can point here, or use it
 * directly). Equivalent to POST /api/contact from the standalone server.
 *
 * Validates, persists the contact and triggers the emails via ExternalCrmService.
 * Register the path as allowed in the dispatcher (same as in the boilerplate).
 */
@Component(
    service = Servlet.class,
    property = {
        "sling.servlet.methods=POST",
        "sling.servlet.paths=/bin/aurelia/contact"
    }
)
public class ContactServlet extends SlingAllMethodsServlet {

    @Reference
    private transient ExternalCrmService crm;

    @Override
    protected void doPost(SlingHttpServletRequest req, SlingHttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        // Anti-bot honeypot: if filled in, fake success and discard.
        String honeypot = req.getParameter("company_website");
        if (honeypot != null && !honeypot.isEmpty()) {
            resp.getWriter().write("{\"ok\":true}");
            return;
        }

        String name = trim(req.getParameter("name"));
        String email = trim(req.getParameter("email"));
        String topic = trim(req.getParameter("topic"));
        String message = trim(req.getParameter("message"));
        String phone = trim(req.getParameter("phone"));
        String locale = req.getParameter("locale") != null ? req.getParameter("locale") : "es";

        // Minimal validation (the source of truth; the client validates for UX).
        if (name.length() < 2 || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") || message.length() < 10
                || !topic.matches("bespoke|appointment|press|other")) {
            resp.setStatus(422);
            resp.getWriter().write("{\"error\":\"validation_error\"}");
            return;
        }

        try {
            crm.saveAndNotify(name, email, phone, topic, message, locale);
            resp.setStatus(201);
            resp.getWriter().write("{\"ok\":true}");
        } catch (Exception e) {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\":\"internal_error\"}");
        }
    }

    private static String trim(String s) { return s == null ? "" : s.trim(); }
}
