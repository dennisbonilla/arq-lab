# DevOps environment with Docker: Jenkins + SonarQube

A complete guide to bring up Jenkins and SonarQube in separate Docker containers,
connected by a shared network, with all the verifications at each step.

> **Context:** You work on Windows with Docker Desktop (WSL2 behind the scenes). Jenkins
> will be used to build Maven projects; SonarQube for code quality analysis.

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [The shared Docker network](#2-the-shared-docker-network)
3. [Jenkins](#3-jenkins)
4. [Configure JDK 11 and Maven in Jenkins](#4-configure-jdk-11-and-maven-in-jenkins)
5. [Pipeline to force tool installation](#5-pipeline-to-force-tool-installation)
6. [SonarQube + PostgreSQL](#6-sonarqube--postgresql)
7. [Verify communication between Jenkins and SonarQube](#7-verify-communication-between-jenkins-and-sonarqube)
8. [Useful reference commands](#8-useful-reference-commands)
9. [Common troubleshooting](#9-common-troubleshooting)

---

## 1. Prerequisites

Before starting, confirm that Docker is installed and running:

```bash
docker --version
docker compose version
```

Both commands must return a version number. If `docker compose version`
fails, your Docker is old and you may use `docker-compose` (with a hyphen) instead.

---

## 2. The shared Docker network

Both services will live in separate containers but must be able to communicate
by **name** (without relying on IPs). For that, an external network is created **once**:

```bash
docker network create devops-net-jenkins-and-docker
```

**Verification** — confirm the network exists:

```bash
docker network ls
```

You should see `devops-net-jenkins-and-docker` in the list with the `bridge` driver.

---

## 3. Jenkins

### 3.1 Jenkins's `docker-compose.jenkins.yml`

Place this file in the Jenkins folder. The important thing is the two `networks`
sections, which attach the container to the shared network.

> **Note about the file name:** in this guide the Jenkins compose is called
> `docker-compose.jenkins.yml` (a custom name, not the default `docker-compose.yml`).
> That's why **all** the Jenkins commands carry the flag
> `-f docker-compose.jenkins.yml`. If you ran a plain `docker compose up -d`,
> Docker would look for a `docker-compose.yml` and, not finding it, would error. If your
> file has a different name, adjust the name after the `-f`.

```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins-local
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
    networks:
      - devops-net-jenkins-and-docker

volumes:
  jenkins_home:

networks:
  devops-net-jenkins-and-docker:
    external: true
```

> `external: true` tells Docker "use the network I already created, not a new one".
> The `jenkins_home` volume stores all your configuration, jobs and plugins, so
> you can recreate the container without losing anything.

### 3.2 Start Jenkins

```bash
docker compose -f docker-compose.jenkins.yml up -d
```

> If the container was already running and you edited the file (for example, to
> add the network), this same command **recreates** the container automatically
> (`Recreating jenkins-local...`). The `jenkins_home` volume is untouched, so you don't
> lose configuration, jobs or plugins.

### 3.3 Jenkins verifications

**a) The container is running:**

```bash
docker ps
```

`jenkins-local` should appear with status `Up`.

**b) Java is included in the image (no need to install it):**

```bash
docker exec -it jenkins-local bash
java -version
```

You'll see something like `openjdk version "21.x"` (Temurin 21 LTS). That's the container's
**system** Java. It's normal and expected.

**c) Maven is NOT included (this is correct):**

```bash
mvn -version
```

It will return `bash: mvn: command not found`. **This is expected.** Maven is not part
of the image and is NOT installed by hand in the container: Jenkins will manage it
(see step 4). Exit the container with `exit`.

> ⚠️ **Important:** Even after you later configure Maven and JDK 11 in Jenkins,
> the container's bash **will still show** Java 21 and **will still not find** `mvn`.
> That's correct: the tools managed by Jenkins only activate **during
> builds**, not in the interactive shell. The real check is done in the
> pipeline's *Console Output*, never in the bash.

### 3.4 Unlock Jenkins (first boot)

Get the initial password:

```bash
docker exec jenkins-local cat /var/jenkins_home/secrets/initialAdminPassword
```

Open `http://localhost:8080`, paste the password and **choose "Install suggested
plugins"**. This is key: it installs the declarative Pipeline plugins you'll
need. Then create your admin user.

---

## 4. Configure JDK 11 and Maven in Jenkins

The container ships Java 21, but many projects (for example, AEM ones) are
built with **JDK 11**. Instead of touching the container, both tools are
configured from the Jenkins UI.

Go to **Manage Jenkins → Tools** and configure:

### 4.1 JDK 11

1. **JDK installations → Add JDK** section.
2. Name: `JDK-11` (write it down, it must match the pipeline's EXACTLY).
3. Check **Install automatically**.
4. Choose a provider (for example, **Eclipse Temurin / Adoptium**) and version 11.

### 4.2 Maven 3.9

1. **Maven installations → Add Maven** section.
2. Name: `Maven-3.9` (write it down, it must match the pipeline's EXACTLY).
3. Check **Install automatically**.
4. Choose version 3.9.x.

Save the changes.

> **Note about compatibility:** Maven 3.9 requires JDK 8 or higher to run,
> so it runs fine on the container's Java 21. But *running Maven* and
> *building your project* are different things: that's why we configure JDK 11, so that
> the **build** targets Java 11 even though Maven starts on another version.

> ⚠️ **Installation doesn't happen on save.** Jenkins only registers the intent to
> download the tools. The actual download happens **the first time a build
> uses them** (see step 5).

---

## 5. Pipeline to force tool installation

This minimal pipeline serves to **trigger the download** of JDK 11 and Maven 3.9 and
confirm they become available.

### 5.1 Create the job

- Create a **Pipeline** job (not "Freestyle project").
- In the configuration: **Pipeline → Definition → Pipeline script**.
- Paste the following script:

```groovy
pipeline {
    agent any

    tools {
        jdk   'JDK-11'      // must match EXACTLY the name in Tools
        maven 'Maven-3.9'   // must match EXACTLY the name in Tools
    }

    stages {
        stage('Verify installations') {
            steps {
                sh 'java -version'
                sh 'mvn -version'
            }
        }
    }
}
```

### 5.2 Run and verify

Run the job and open its **Console Output**. There you should see:

- `java -version` reporting **11.x** (not the container's 21!).
- `mvn -version` showing **Maven 3.9.x** and, below, `Java version: 11...`
  confirming that Maven uses JDK 11.

If you see that, the tools were installed correctly.

### 5.3 Additional verification from the bash (optional)

The downloaded tools live inside the container. You can confirm it by
looking at the tools folder (NOT with the `mvn` command, which will still not exist):

```bash
docker exec -it jenkins-local bash
ls /var/jenkins_home/tools/
```

After a successful build you'll see folders like `hudson.tasks.Maven_MavenInstallation`
and `hudson.model.JDK`. If the `tools` folder doesn't exist or is empty, it means no
build has used the tools yet.

---

## 6. SonarQube + PostgreSQL

SonarQube needs a **PostgreSQL** database for serious use (the embedded H2
database only works for quick tests and doesn't allow upgrades).

### 6.1 SonarQube's `docker-compose.sonarqube.yml`

Create a separate folder (for example `SonarQube/`) with this file. Notice that
both SonarQube and PostgreSQL are on the same `devops-net-jenkins-and-docker` network.

> **About the name:** like Jenkins, this file uses a custom name
> (`docker-compose.sonarqube.yml`), so **all** its commands carry
> `-f docker-compose.sonarqube.yml`. If you name it differently, adjust the name after the `-f`.

```yaml
services:
  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    restart: unless-stopped
    depends_on:
      - db
    ports:
      - "9000:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://db:5432/sonar
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs
    networks:
      - devops-net-jenkins-and-docker

  db:
    image: postgres:15
    container_name: sonarqube_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonar
    volumes:
      - postgresql_data:/var/lib/postgresql/data
    networks:
      - devops-net-jenkins-and-docker

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  postgresql_data:

networks:
  devops-net-jenkins-and-docker:
    external: true
```

### 6.2 Start SonarQube

```bash
docker compose -f docker-compose.sonarqube.yml up -d
```

The first boot **takes 1-2 minutes** while Elasticsearch and the database start.

### 6.3 SonarQube verifications

**a) The containers are running:**

```bash
docker ps
```

`sonarqube` and `sonarqube_db` should appear, both `Up`.

**b) Follow the startup in the logs:**

```bash
docker compose -f docker-compose.sonarqube.yml logs -f sonarqube
```

Wait until you see a message like `SonarQube is operational`. With `Ctrl+C` you exit
the log follow (it doesn't stop the container).

**c) Web access:**

Open `http://localhost:9000`. Initial credentials: `admin` / `admin`
(it will force you to change the password on the first login).

---

## 7. Verify communication between Jenkins and SonarQube

This is the step that confirms the shared network works. Enter the Jenkins
container and try to reach SonarQube **by its name**:

```bash
docker exec -it jenkins-local bash
curl -I http://sonarqube:9000
```

If it responds with `HTTP/1.1 200` (or a `3xx` redirect), **communication works**.
That URL, `http://sonarqube:9000`, is exactly the one you'll use when configuring
SonarQube inside Jenkins.

> If `curl` isn't installed in the container, you can try `wget -S http://sonarqube:9000`
> or install it temporarily. It's a minor detail; what matters is that the name
> `sonarqube` resolves from the Jenkins container.

---

## 8. Useful reference commands

### Jenkins (from its folder)

Remember: since the file is called `docker-compose.jenkins.yml`, all commands
carry `-f`.

```bash
docker compose -f docker-compose.jenkins.yml up -d      # start / recreate
docker compose -f docker-compose.jenkins.yml down       # stop and remove
docker compose -f docker-compose.jenkins.yml stop       # stop only
docker compose -f docker-compose.jenkins.yml logs -f    # view live logs
docker exec -it jenkins-local bash                      # enter the container
```

### SonarQube (from its folder)

Like Jenkins, the file has a custom name, so all commands
carry `-f`.

```bash
docker compose -f docker-compose.sonarqube.yml up -d          # start
docker compose -f docker-compose.sonarqube.yml stop           # stop
docker compose -f docker-compose.sonarqube.yml start          # start again after a stop
docker compose -f docker-compose.sonarqube.yml logs -f sonarqube     # view startup
docker compose -f docker-compose.sonarqube.yml down           # stop and remove containers (volumes persist)
```

### Network

```bash
docker network ls                       # list networks
docker network inspect devops-net-jenkins-and-docker       # see which containers are connected
```

---

## 9. Common troubleshooting

### `No such property: any` when running the pipeline

The **declarative Pipeline** plugin is missing. Go to *Manage Jenkins → Plugins →
Available plugins*, install **Pipeline** and **Pipeline: Declarative**, and restart
Jenkins. This usually happens when "select plugins manually" was chosen during
installation instead of "install suggested plugins".

### `No such tool named 'JDK-11'` (or `'Maven-3.9'`)

The name in the pipeline's `tools` block doesn't match EXACTLY the one in
*Manage Jenkins → Tools*. Check them character by character.

### The container's bash doesn't show Maven / shows Java 21

**It's correct, not an error.** The tools managed by Jenkins only
activate during builds, not in the shell. Check in the pipeline's *Console Output*,
not in the bash.

### `network devops-net-jenkins-and-docker declared as external, but could not be found`

You tried to start a container before creating the shared network. Create it and
start again:

```bash
docker network create devops-net-jenkins-and-docker
docker compose -f docker-compose.jenkins.yml up -d
```

### `no configuration file provided: not found` (or similar) when using compose

You ran `docker compose` without `-f` and your file isn't called `docker-compose.yml`.
Add the flag with the real name, for example `-f docker-compose.jenkins.yml`.

### SonarQube restarts in a loop

Elasticsearch (which SonarQube uses internally) requires a minimum value of
`vm.max_map_count` on the host. On Linux:

```bash
sudo sysctl -w vm.max_map_count=524288
```

To make it permanent, add it to `/etc/sysctl.conf`. On Docker Desktop for
Windows it's usually configured, but it's the first suspect if the container
won't start. Always check `docker compose -f docker-compose.sonarqube.yml logs -f sonarqube` for the exact message.

---

## Next steps (application-level integration)

With the containers communicating, the integration inside Jenkins remains:

1. In **SonarQube**: create an *authentication token* for Jenkins.
2. In **Jenkins**: install the **SonarQube Scanner** plugin and configure the server
   in *Manage Jenkins → System*, pointing to `http://sonarqube:9000` with the token.
3. In the **pipeline**: add a stage with `withSonarQubeEnv` that runs the analysis.

That's already application configuration, not Docker, and it's the next topic to tackle.
