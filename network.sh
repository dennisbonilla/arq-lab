#!/usr/bin/env bash
# Creates the lab's shared network (idempotent: doesn't fail if it already exists).
set -euo pipefail

NETWORK="devops-net-jenkins-and-docker"

if [ "$(docker network ls --filter "name=^${NETWORK}$" --format '{{.Name}}')" = "$NETWORK" ]; then
    echo "Network '$NETWORK' already exists."
else
    docker network create "$NETWORK" >/dev/null
    echo "Network '$NETWORK' created."
fi
