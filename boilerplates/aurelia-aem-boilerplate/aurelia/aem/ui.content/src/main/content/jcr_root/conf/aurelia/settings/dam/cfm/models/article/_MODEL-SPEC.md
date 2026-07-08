# CF Model: Article  →  /conf/aurelia/settings/dam/cfm/models/article

Fields:

| Field label   | Property name | Field type           | Notes                        |
|---------------|---------------|----------------------|------------------------------|
| Title         | title         | Single line text     | Localizable                  |
| Excerpt       | excerpt       | Multi line text      | Localizable                  |
| Author        | author        | Single line text     |                              |
| Tag           | tag           | Single line text     | Localizable                  |
| Body          | body          | Multi line text (RTE)| Multi-paragraph rich text    |
| Hero          | hero          | Content Reference    | DAM asset                    |
| Hero Alt      | heroAlt       | Single line text     |                              |
| Read minutes  | readMinutes   | Number               |                              |
| Slug          | slug          | Single line text     | For detail routing           |

Getters in `ArticleModel.java`. Instances under **/content/dam/aurelia/journal/**
with the values from `server/src/data/articles.json`.
