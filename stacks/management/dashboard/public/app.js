// ---------------- Translations ----------------
const I18N = {
  es: {
    locale: "es",
    eyebrow: "Laboratorio local · Docker",
    title: "Sala de control",
    onlineLabel: "servicios en línea",
    open: "Abrir →",
    sharedNet: "Red compartida",
    checking: "Comprobando estado…",
    lastCheck: (t) => "Última comprobación " + t,
    checkError: "No se pudo comprobar el estado",
    online: "en línea",
    offline: "sin conexión",
    aem_author:      "Instancia de edición de AEM 6.5.",
    aem_publish:     "Instancia pública de AEM 6.5.",
    aemaacs_author:  "Edición de AEM as a Cloud Service (SDK local).",
    aemaacs_publish: "Publicación de AEM as a Cloud Service (SDK local).",
    roles: {
      jenkins:    "Orquesta y ejecuta los pipelines de CI/CD.",
      sonarqube:  "Analiza la calidad y seguridad del código.",
      nexus:      "Almacena artefactos y cachea dependencias.",
      selenium:   "Corre pruebas de interfaz en un navegador real.",
      prometheus: "Recolecta métricas del host y los contenedores.",
      grafana:    "Grafica y explora la telemetría en dashboards.",
      cadvisor:   "Métricas de uso por contenedor en tiempo real.",
      gitea:      "Servidor Git ligero para tus repositorios.",
      gitlab:     "Servidor Git completo, con más funciones.",
      portainer:  "Administra Docker de forma visual.",
      keycloak:   "Inicio de sesión único (SSO) para todo.",
      vault:      "Gestiona secretos y credenciales de forma segura.",
      mailhog:    "Captura los correos de prueba del laboratorio.",
    },
  },
  en: {
    locale: "en",
    eyebrow: "Local lab · Docker",
    title: "Control room",
    onlineLabel: "services online",
    open: "Open →",
    sharedNet: "Shared network",
    checking: "Checking status…",
    lastCheck: (t) => "Last check " + t,
    checkError: "Couldn't check status",
    online: "online",
    offline: "offline",
    aem_author:      "AEM 6.5 authoring instance.",
    aem_publish:     "AEM 6.5 publish instance.",
    aemaacs_author:  "AEM as a Cloud Service authoring (local SDK).",
    aemaacs_publish: "AEM as a Cloud Service publish (local SDK).",
    roles: {
      jenkins:    "Orchestrates and runs your CI/CD pipelines.",
      sonarqube:  "Analyzes code quality and security.",
      nexus:      "Stores build artifacts and caches dependencies.",
      selenium:   "Runs UI tests in a real browser.",
      prometheus: "Collects metrics from the host and containers.",
      grafana:    "Charts and explores telemetry in dashboards.",
      cadvisor:   "Real-time per-container usage metrics.",
      gitea:      "Lightweight Git server for your repositories.",
      gitlab:     "Full-featured Git server.",
      portainer:  "Manage Docker visually.",
      keycloak:   "Single sign-on (SSO) for everything.",
      vault:      "Securely manages secrets and credentials.",
      mailhog:    "Captures the lab's test emails.",
    },
  },
};

// ---------------- State ----------------
const serviceStates = {};      // id -> boolean
const serviceDetail = {};      // id -> failure reason
let currentLang = "es";
let lastState = "pending";     // 'pending' | 'ok' | 'error'
let lastCheckDate = null;

// ---------------- Live clock ----------------
function tickClock() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("clock").textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById("clock-date").textContent =
    now.toLocaleDateString(I18N[currentLang].locale, { weekday: "short", day: "numeric", month: "short" });
}

// ---------------- Per-card status ----------------
function applyStatus(id, online, detail) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (!card) return;
  const badge = card.querySelector("[data-status]");
  const text = badge.querySelector(".status-text");
  badge.classList.remove("is-online", "is-offline");
  badge.classList.add(online ? "is-online" : "is-offline");
  text.textContent = online ? I18N[currentLang].online : I18N[currentLang].offline;
  // Tooltip with the reason when offline (timeout, ENOTFOUND, etc.)
  badge.title = online ? "" : (detail ? "Reason: " + detail : "");
}

function renderOnlineCount() {
  const ids = Object.keys(serviceStates);
  if (ids.length === 0) return;
  const online = ids.filter((id) => serviceStates[id]).length;
  document.getElementById("online-count").textContent = `${online}/${ids.length}`;
}

function renderLastCheck() {
  const t = I18N[currentLang];
  const el = document.getElementById("last-check");
  if (lastState === "pending") { el.textContent = t.checking; return; }
  if (lastState === "error")   { el.textContent = t.checkError; return; }
  el.textContent = t.lastCheck(lastCheckDate.toLocaleTimeString(t.locale));
}

// ---------------- Language switch ----------------
function applyLang(lang) {
  currentLang = lang;
  const t = I18N[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll(".lang-btn").forEach((b) => {
    const active = b.dataset.lang === lang;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key === "role") {
      el.textContent = t.roles[el.closest(".card").dataset.id];
    } else if (typeof t[key] === "string") {
      el.textContent = t[key];
    }
  });

  Object.keys(serviceStates).forEach((id) => applyStatus(id, serviceStates[id], serviceDetail[id]));
  renderLastCheck();
  tickClock();

  try { localStorage.setItem("dashboard-lang", lang); } catch (e) {}
}

// ---------------- Status polling ----------------
async function refreshStatus() {
  try {
    const res = await fetch("/api/status", { cache: "no-store" });
    const data = await res.json();
    const detail = data.detail || {};
    Object.keys(data.status).forEach((id) => {
      serviceStates[id] = data.status[id];
      serviceDetail[id] = detail[id];
      applyStatus(id, data.status[id], detail[id]);
    });
    lastState = "ok";
    lastCheckDate = new Date(data.checkedAt);
    renderOnlineCount();
    updateGroupCounts();
    renderLastCheck();
  } catch (err) {
    lastState = "error";
    renderLastCheck();
  }
}

// ---------------- Bootstrap ----------------
document.querySelectorAll(".lang-btn").forEach((b) => {
  b.addEventListener("click", () => applyLang(b.dataset.lang));
});

let initialLang = "es";
try {
  const saved = localStorage.getItem("dashboard-lang");
  if (saved === "es" || saved === "en") initialLang = saved;
  else if (navigator.language && !navigator.language.toLowerCase().startsWith("es")) initialLang = "en";
} catch (e) {}

// ---------------- Collapsible sections ----------------
function initGroups() {
  document.querySelectorAll(".group-head").forEach((head) => {
    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      saveGroupStates();
    });
  });
  restoreGroupStates();
  updateGroupCounts();
}

// Counts how many status-bearing cards are online per group, and the totals.
function updateGroupCounts() {
  document.querySelectorAll(".group").forEach((group) => {
    const cards = group.querySelectorAll(".card");
    const withStatus = group.querySelectorAll(".card[data-id]");
    let online = 0;
    withStatus.forEach((c) => { if (serviceStates[c.dataset.id]) online++; });
    const countEl = group.querySelector(".group-count");
    if (!countEl) return;
    // If the group has status-bearing services, show online/total-with-status.
    // If not (e.g. AEM consoles), show only the total number of cards.
    if (withStatus.length > 0) {
      countEl.textContent = `${online}/${withStatus.length}`;
    } else {
      countEl.textContent = `${cards.length}`;
    }
  });
}

// Remembers which groups are open (in the browser's session storage).
function saveGroupStates() {
  try {
    const st = {};
    document.querySelectorAll(".group").forEach((g) => {
      st[g.dataset.group] = g.querySelector(".group-head").getAttribute("aria-expanded");
    });
    localStorage.setItem("dashboard-groups", JSON.stringify(st));
  } catch (e) {}
}
function restoreGroupStates() {
  try {
    const raw = localStorage.getItem("dashboard-groups");
    if (!raw) return;
    const st = JSON.parse(raw);
    document.querySelectorAll(".group").forEach((g) => {
      if (st[g.dataset.group]) {
        g.querySelector(".group-head").setAttribute("aria-expanded", st[g.dataset.group]);
      }
    });
  } catch (e) {}
}

applyLang(initialLang);
tickClock();
setInterval(tickClock, 2000);
refreshStatus();
initGroups();
setInterval(refreshStatus, 20000); // every 20 s