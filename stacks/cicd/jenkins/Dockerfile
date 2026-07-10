# ============================================================================
#  Imagen Jenkins + Docker CLI + Trivy
#  La imagen oficial jenkins/jenkins:lts NO trae el cliente docker ni trivy.
#  Sin esto, los stages que hagan "docker build" o "trivy fs/image" fallan
#  con "command not found", aunque montes el socket y la red esté OK.
# ============================================================================
FROM jenkins/jenkins:lts

USER root

# --- Cliente Docker (CLI) + plugin docker compose v2 ---
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates curl gnupg lsb-release \
 && install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc \
 && chmod a+r /etc/apt/keyrings/docker.asc \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
      > /etc/apt/sources.list.d/docker.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends docker-ce-cli docker-compose-plugin \
 && rm -rf /var/lib/apt/lists/*

# --- Cliente Trivy (para los stages de escaneo fs/image) ---
# Copia el binario ya compilado desde la imagen oficial de Trivy: sin repos apt,
# sin dependencias. Es un binario estático de Go, funciona con un COPY simple.
COPY --from=aquasec/trivy:latest /usr/local/bin/trivy /usr/local/bin/trivy

# --- Permite que el usuario 'jenkins' use el socket de docker montado desde el host ---
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins

# --- Plugins Jenkins usados por los Jenkinsfile de este repo ---
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt || true
