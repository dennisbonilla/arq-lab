#!/usr/bin/env bash
# Starts an individual stack or a full phase.
#
# Usage:
#   ./start.sh jenkins        # a single service
#   ./start.sh monitoring     # the monitoring stack
#   ./start.sh daily          # the daily-work "phase" (several stacks)
#   ./start.sh aem            # AEM
#
# Adjust the paths if you move the files.
set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <stack|phase>" >&2
    exit 1
fi
TARGET="$1"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure the network first.
"$SCRIPT_DIR/network.sh"

# Map: name -> compose file (relative to the repo root).
stack_file() {
    case "$1" in
        jenkins)    echo "stacks/cicd/jenkins/docker-compose.jenkins.yml" ;;
        sonarqube)  echo "stacks/cicd/sonarqube/docker-compose.sonarqube.yml" ;;
        nexus)      echo "stacks/cicd/nexus/docker-compose.nexus.yml" ;;
        selenium)   echo "stacks/cicd/selenium/docker-compose.selenium.yml" ;;
        gitea)      echo "stacks/cicd/git/docker-compose.gitea.yml" ;;
        gitlab)     echo "stacks/cicd/git/docker-compose.gitlab.yml" ;;
        monitoring) echo "stacks/monitoring/docker-compose.monitoring.yml" ;;
        dashboard)  echo "stacks/management/docker-compose.dashboard.yml" ;;
        portainer)  echo "stacks/management/docker-compose.portainer.yml" ;;
        data)       echo "stacks/data/docker-compose.data.yml" ;;
        keycloak)   echo "stacks/security/docker-compose.keycloak.yml" ;;
        vault)      echo "stacks/security/docker-compose.vault.yml" ;;
        trivy)      echo "stacks/security/docker-compose.trivy.yml" ;;
        networking) echo "stacks/networking/docker-compose.networking.yml" ;;
        aem)        echo "stacks/aem65/docker-compose.aem65.yml" ;;
        *)          echo "" ;;
    esac
}

# Phases: groupings of stacks.
phase_stacks() {
    case "$1" in
        all)     echo "jenkins sonarqube nexus selenium gitea gitlab monitoring dashboard portainer data keycloak vault trivy networking aem" ;;
        daily)   echo "jenkins sonarqube nexus selenium gitea monitoring dashboard portainer data trivy" ;;
        aemmode) echo "jenkins sonarqube nexus selenium gitea monitoring dashboard data aem" ;;
        *)       echo "" ;;
    esac
}

start_stack() {
    local name="$1"
    local rel
    rel="$(stack_file "$name")"
    if [ -z "$rel" ]; then
        echo "Unknown stack: $name" >&2
        return
    fi
    echo "Starting $name ..."
    docker compose -f "$SCRIPT_DIR/$rel" up -d
}

phase="$(phase_stacks "$TARGET")"
if [ -n "$phase" ]; then
    for s in $phase; do start_stack "$s"; done
else
    start_stack "$TARGET"
fi
