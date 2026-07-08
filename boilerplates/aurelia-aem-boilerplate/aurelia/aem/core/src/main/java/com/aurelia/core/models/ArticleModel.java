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
 * ArticleModel — the AEM equivalent of ArticleCard.jsx / StoryDetail.jsx.
 * Reads a Content Fragment of the "Article" model from ./fragmentPath.
 */
@Model(adaptables = SlingHttpServletRequest.class)
public class ArticleModel {

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

    public String getTitle()   { return el("title"); }
    public String getExcerpt() { return el("excerpt"); }
    public String getAuthor()  { return el("author"); }
    public String getTag()     { return el("tag"); }
    /** Multi-paragraph rich text (body) for the detail view. */
    public String getBody()    { return el("body"); }
    public String getReadMinutes() { return el("readMinutes"); }
    public String getHeroSrc() { return el("hero"); }
    public String getHeroAlt() { return el("heroAlt"); }
    public String getSlug()    { return el("slug"); }

    /** The actual routing depends on your site structure; adjust accordingly. */
    public String getDetailUrl() {
        String slug = getSlug();
        return slug.isEmpty() ? "#" : (slug + ".html");
    }
}
