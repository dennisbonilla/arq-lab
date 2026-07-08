package com.aurelia.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;

/**
 * PieceModel — the AEM equivalent of the PieceCard.jsx logic.
 *
 * Reads a Content Fragment of the "Piece" model from the ./fragmentPath property
 * (authored via the dialog) and exposes its fields to the HTL view.
 *
 * Localization note (MSM): to serve per language, fetch the fragment variation
 * matching the language-copy of the current page. Here the master is read for
 * simplicity; the boilerplate's i18n pattern already lives in the dictionaries
 * under /apps/aurelia/i18n.
 */
@Model(adaptables = SlingHttpServletRequest.class)
public class PieceModel {

    @Self
    private SlingHttpServletRequest request;

    @ValueMapValue(name = "fragmentPath")
    private String fragmentPath;

    private ContentFragment fragment;

    @PostConstruct
    protected void init() {
        if (fragmentPath == null || fragmentPath.isEmpty()) {
            return;
        }
        ResourceResolver resolver = request.getResourceResolver();
        Resource res = resolver.getResource(fragmentPath);
        if (res != null) {
            fragment = res.adaptTo(ContentFragment.class);
        }
    }

    private String el(String elementName) {
        if (fragment == null) {
            return "";
        }
        ContentElement e = fragment.getElement(elementName);
        return (e != null && e.getContent() != null) ? e.getContent() : "";
    }

    public String getName()      { return el("name"); }
    public String getCollection(){ return el("collection"); }
    public String getMetal()     { return el("metal"); }
    public String getGemstone()  { return el("gemstone"); }
    public String getNotes()     { return el("notes"); }
    public String getCarat()     { return el("carat"); }
    public String getRef()       { return el("ref"); }

    /** 'image' is a content-reference: returns the asset path in the DAM. */
    public String getImageSrc()  { return el("image"); }
    public String getImageAlt()  { return el("imageAlt"); }
}
