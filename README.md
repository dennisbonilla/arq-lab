# Arc-Lab

WELCOME TO MY PERSONAL PORTFOLIO.

Arq-Lab is a personal and professional development portfolio created and maintained by Dennis Bonilla R, a book of useful recipes for day-to-day development.

# AEM-LABS · Lab structure

A map of the lab's actual structure, with the purpose (or potential use) of each
folder alongside. Meant as a reference to know where everything goes.

> Convention: each domain (stack) groups the services that work together. Not
> every service has its own top-level folder; many live grouped inside their
> domain (e.g. Grafana is in `monitoring/`, Postgres in `data/`).

```
01-DOCKER-RECIPIES/
│
├── docs/                    → Lab documentation (architecture, guides, per-domain notes).
│
├── scripts/                 → Entry script (lab.ps1) that builds images and starts/stops stacks.
│
├── shared/                  → Resources shared across stacks.
│   ├── backups/             → Docker volume backups (dumps, one-off exports).
│   └── scripts/             → Reusable helpers (common functions, utilities used by several stacks).
│
└── stacks/                  → All lab domains, one per folder.
    │
    ├── aem/                 → Adobe Experience Manager 6.5 (author, publish, dispatcher).
    │   │
    │   ├── author/          → Authoring instance. Contains the jar (aem-author-p4502.jar) + its license.
    │   │                       (crx-quickstart/ is AEM already unpacked; AEM generates it itself, don't touch.)
    │   │
    │   ├── publish/         → Publish instance. Contains the jar (aem-publish-p4503.jar) + its license.
    │   │                       The container must be named aem65-publish (the dispatcher expects it).
    │   │
    │   ├── dispatcher/      → Your own dispatcher image (modern Apache 2.4 + Adobe module).
    │   │   ├── conf/        → httpd.conf (loads the module) + dispatcher.any (cache and backend rules).
    │   │   ├── modules/     → mod_dispatcher.so and mod_dispatcher_ssl.so (extracted from the original container).
    │   │   ├── dispatcher-aem65/    → Config/variant for the classic AEM 6.5 dispatcher.
    │   │   └── dispatcher-aemaacs/  → Config/variant for the AEM Cloud Service dispatcher (future use / comparison).
    │   │
    │   ├── config/          → (Reserved) OSGi configurations. In 6.5 they usually go in the code project,
    │   │                       so it's empty today; useful later for templates or startup configs.
    │   │
    │   ├── license/         → Centralized AEM license. NOTE: AEM looks for it next to each jar, so the
    │   │                       real license must also be copied to author/ and publish/. NEVER version it.
    │   │
    │   └── packages/        → AEM content/code packages (.zip) to install on the instances.
    │
    ├── cicd/                → Continuous integration and delivery (the heart of the pipeline).
    │   ├── git/             → Local Git servers (lightweight Gitea; heavy GitLab, on demand).
    │   ├── Jenkins/         → Pipeline orchestrator (Jenkins compose).
    │   ├── Jenkins+SonarQube-Connected/ → Variant/experiment with Jenkins and SonarQube already integrated.
    │   │                                   (Consolidate or rename; see notes below.)
    │   ├── nexus/           → Artifact repository (and possible private Docker registry).
    │   ├── Selenium/        → UI test grid (hub + Chrome node).
    │   └── SonarQube/       → Code quality and security analysis (+ its Postgres).
    │
    ├── data/                → Supporting data services for the rest of the lab.
    │   ├── postgres/        → General-purpose database (used by SonarQube, Keycloak, etc.).
    │   ├── redis/           → In-memory cache (for apps that need it).
    │   └── mailhog/         → Test SMTP server: captures outgoing emails and shows them on the web.
    │
    ├── management/          → Tools to operate and visualize the lab.
    │   └── dashboard/       → Your Node app (panel with access cards to each service + live status).
    │       └── public/      → Dashboard front end (index.html, app.js, styles.css).
    │                          (Portainer, visual Docker management, also lives in this domain.)
    │
    ├── monitoring/          → Observability: metrics, logs and visualization.
    │   └── dashboards/      → Grafana dashboard JSON to import.
    │                          (Prometheus, Loki, Promtail, Grafana and the exporters live here.)
    │
    ├── networking/          → Lab exposure and routing.
    │   ├── traefik/         → Dynamic reverse proxy (routes by labels, without editing config by hand).
    │   ├── cloudflared/     → Cloudflare tunnel to expose the lab to the internet without opening ports.
    │   └── certificates/    → SSL/TLS certificates for local HTTPS.
    │
    └── security/            → DevSecOps domain: identity, secrets and scanning.
                               (Keycloak (SSO), Vault (secrets) and Trivy (vulnerabilities) live here.)
```

## Where each service lives (quick reference)

Some services you were asking "where are they": they're not missing, they're grouped by domain.

| Service     | Lives in          | Function                                         |
|-------------|-------------------|--------------------------------------------------|
| Jenkins     | cicd/Jenkins      | Orchestrates the pipelines                        |
| SonarQube   | cicd/SonarQube    | Code quality and security                         |
| Nexus       | cicd/nexus        | Artifact repository                               |
| Selenium    | cicd/Selenium     | UI tests                                          |
| Gitea/GitLab| cicd/git          | Git servers                                       |
| Prometheus  | monitoring        | Metrics                                           |
| Grafana     | monitoring        | Metrics and logs dashboards                       |
| Loki        | monitoring        | Log store                                         |
| Postgres    | data/postgres     | Database                                          |
| Redis       | data/redis        | Cache                                             |
| MailHog     | data/mailhog      | Test SMTP                                         |
| Portainer   | management        | Visual Docker management                          |
| Dashboard   | management/dashboard | Access panel for everything                    |
| Traefik     | networking/traefik| Reverse proxy                                     |
| Cloudflared | networking/cloudflared | External access tunnel                      |
| Keycloak    | security          | Single Sign-On                                    |
| Vault       | security          | Secrets management                                |
| Trivy       | security          | Vulnerability scanning                            |
| AEM Author  | aem/author        | Content authoring                                 |
| AEM Publish | aem/publish       | Public site                                       |
| Dispatcher  | aem/dispatcher    | Cache and security in front of Publish            |

## Notes and things to tidy up (at your discretion)

1. **`cicd/` with uppercase, mixed names** (Jenkins, SonarQube, Selenium vs
   nexus, git). On Windows it breaks nothing, but Linux is case-sensitive. If you ever
   take this to Linux or the pipeline, it's worth unifying to lowercase.

2. **`Jenkins+SonarQube-Connected/`** looks like an experiment or backup from when
   you integrated both. It's worth deciding whether it's the "good" version (and consolidating) or
   a backup you can archive, so you don't have two sources of truth.

3. **`dispatcher-aem65/` and `dispatcher-aemaacs/`**: you have two variants. Confirm
   which one your `aem-dispatcher:6.5` image uses (the 6.5 one) to know which is active and
   which is reference/future.

4. **The license**: it's in `license/`, but AEM looks for it next to each jar. Make sure
   you have a copy in `author/` and another in `publish/`, or AEM won't fully start.

5. **Empty `config/`**: normal for 6.5. Leave it as a reserve or delete it; no impact.

6. **Numbering folders**: you decided not to, a good choice. The logical order is already
   given by this documentation; numbering would have broken paths in the script and in the
   compose relative volumes without adding much.

### Start (create and boot) in the background
docker compose -f docker-compose.jenkins.yml up -d

### Stop and remove containers (volumes are kept)
docker compose -f docker-compose.jenkins.yml down

### Rebuild the image and start (when you changed the Dockerfile or the code)
docker compose -f docker-compose.jenkins.yml up -d --build

### Recreate from scratch, without reusing cache
docker compose -f docker-compose.jenkins.yml up -d --force-recreate

## Port order.

| Platform       | Port        |
|----------------|-------------|
| Dashboard      | 8080        |
| AEM 6.5        | 4502 / 4503 |
| AEMaaCS        | 4504 / 4505 |
| Jenkins        | 8081        |
| SonarQube      | 8082        |
| Nexus          | 8098        |
| Selenium       | 8084        |
| Gitea          | 8085        |
| Gitlab         | 8086        |
| Portainer      | 8087        |
| Mailhog        | 8088        |
| Prometeus      | 8089        |
| Grafna         | 8090        |
| Node Exporter  | 8091        |
| cAdvisor       | 8092        |
| Traefik        | 8093        |
| Keycloak       | 8094        |
| Vault          | 8095        |



## © Copyright
Copyright (c) 2026 Dennis Bonilla Ramírez. Todos los derechos reservados.
