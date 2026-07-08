import express from "express";
import net from "node:net";
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 9002;

// Services to watch. host/port are the INTERNAL name and port of the
// container on the shared network (not the Windows host's).
const TOOLS = [
  { id: "aem-author",      host: "aem65-author",    port: 4502 },
  { id: "aem-publish",     host: "aem65-publish",   port: 4503 },
  { id: "aemaacs-author",  host: "aemaacs-author",  port: 4502 },
  { id: "aemaacs-publish", host: "aemaacs-publish", port: 4503 },
  { id: "jenkins",    host: "jenkins-local", port: 8080 },
  { id: "sonarqube",  host: "sonarqube",     port: 9000 },
  { id: "nexus",      host: "nexus",         port: 8081 },
  { id: "selenium",   host: "selenium-hub",  port: 4444 },
  { id: "prometheus", host: "prometheus",    port: 9090 },
  { id: "grafana",    host: "grafana",       port: 3000 },
  { id: "cadvisor",   host: "cadvisor",      port: 8080 },
  { id: "gitea",      host: "gitea",         port: 3000 },
  { id: "gitlab",     host: "gitlab",        port: 8101 },
  { id: "portainer",  host: "portainer",     port: 9443 },
  { id: "keycloak",   host: "keycloak",      port: 8080 },
  { id: "vault",      host: "vault",         port: 8200 },
  { id: "mailhog",    host: "mailhog",       port: 8025 },
];

// ---------------------------------------------------------------------------
// DNS cache. Resolving the same name on every request saturated Docker's DNS
// (which is why sometimes everything worked and sometimes everything timed out).
// Here we resolve each name ONCE and store the IP; if a name doesn't resolve
// (service down), we retry it after a while.
// ---------------------------------------------------------------------------
const dnsCache = new Map();          // host -> { ip, ts }
const DNS_TTL_OK = 60000;            // remember a good IP for 60 s
const DNS_TTL_FAIL = 10000;          // retry a failed name after 10 s

function resolveOnce(host) {
  return new Promise((resolve) => {
    dns.lookup(host, (err, address) => resolve(err ? null : address));
  });
}

async function getIp(host) {
  const cached = dnsCache.get(host);
  const now = Date.now();
  if (cached) {
    const ttl = cached.ip ? DNS_TTL_OK : DNS_TTL_FAIL;
    if (now - cached.ts < ttl) return cached.ip;
  }
  const ip = await resolveOnce(host);
  dnsCache.set(host, { ip, ts: now });
  return ip;
}

// Connects to an already-resolved IP. Never resolves names here.
function connectIp(ip, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (online, error) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ online, error: error || null });
    };
    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false, "timeout"));
    socket.once("error", (e) => finish(false, e.code || "error"));
    socket.connect(port, ip);
  });
}

async function checkService(t) {
  const ip = await getIp(t.host);
  if (!ip) return { id: t.id, online: false, error: "dns" };
  const r = await connectIp(ip, t.port);
  return { id: t.id, online: r.online, error: r.error };
}

app.get("/api/status", async (_req, res) => {
  const checks = await Promise.all(TOOLS.map(checkService));
  for (const c of checks) {
    if (!c.online) console.log(`[status] ${c.id} offline -> ${c.error}`);
  }
  res.json({
    status: Object.fromEntries(checks.map((c) => [c.id, c.online])),
    detail: Object.fromEntries(checks.map((c) => [c.id, c.error])),
    checkedAt: new Date().toISOString(),
  });
});

app.get("/healthz", (_req, res) => res.send("ok"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Dashboard listening on http://localhost:${PORT}`);
});