#!/usr/bin/env bash
# Shows the lab status: containers and network.
set -uo pipefail

NETWORK="devops-net-jenkins-and-docker"

printf '\n=== Containers ===\n'
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

printf '\n=== Containers on the '\''%s'\'' network ===\n' "$NETWORK"
if docker network inspect "$NETWORK" >/dev/null 2>&1; then
    docker network inspect "$NETWORK" --format '{{range .Containers}}{{.Name}} {{end}}'
    echo
else
    echo "The '$NETWORK' network doesn't exist yet. Run network.sh."
fi

printf '\n=== Resource usage ===\n'
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
