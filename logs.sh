#!/usr/bin/env bash
# Shows a container's logs live.
#
# Usage:
#   ./logs.sh jenkins-local
#   ./logs.sh prometheus
set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <container>" >&2
    exit 1
fi

docker logs -f "$1"
