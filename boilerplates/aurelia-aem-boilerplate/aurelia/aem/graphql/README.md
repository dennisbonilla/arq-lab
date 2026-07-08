# Persisted GraphQL (replaces server/routes/content.js + client/lib/api.js)

In the standalone project, the client reads `/api/content/*`. In AEM, those endpoints
are replaced by the **persisted GraphQL** of Content Fragments.

## 1) Enable the GraphQL endpoint for the `aurelia` config
Tools → Assets → GraphQL → add the endpoint for `/conf/aurelia`.

## 2) Create the persisted queries (examples below)
Save them with these names; they are invoked via GET.

### piecesByLocale
```graphql
query ($locale: String!) {
  pieceList(filter: { _path: { _expressions: [{ value: "/content/dam/aurelia/pieces" }] } }) {
    items {
      _path
      name
      collection
      metal
      gemstone
      notes
      carat
      ref
    }
  }
}
```
Invocation:
```
GET /graphql/execute.json/aurelia/piecesByLocale;locale=es
```

### articleBySlug
```graphql
query ($slug: String!) {
  articleList(filter: { slug: { _expressions: [{ value: $slug }] } }) {
    items { title excerpt author tag body { html } slug }
  }
}
```
```
GET /graphql/execute.json/aurelia/articleBySlug;slug=las-4c-de-un-diamante
```

> The shape of these responses is the same one the React client already consumed,
> which is why the front-end migration (if you use the SPA Editor) is almost transparent.
