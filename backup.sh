#!/usr/bin/env bash
# Backs up the Docker volumes to .tar.gz files in shared/backups/.
#
# Usage:
#   ./backup.sh                 # backs up a predefined list
#   ./backup.sh jenkins_home    # backs up a specific volume
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/shared/backups"
mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y%m%d-%H%M%S)"

# Volumes backed up by default.
DEFAULTS=(
    jenkins_home nexus_data gitea_data grafana_data
    prometheus_data loki_data portainer_data postgres_data
)

if [ "$#" -ge 1 ] && [ -n "$1" ]; then
    TARGETS=("$1")
else
    TARGETS=("${DEFAULTS[@]}")
fi

for vol in "${TARGETS[@]}"; do
    if [ "$(docker volume ls --filter "name=^${vol}$" --format '{{.Name}}')" != "$vol" ]; then
        echo "Volume '$vol' not found, skipping."
        continue
    fi
    out="$vol-$STAMP.tar.gz"
    echo "Backing up $vol -> $out"
    # Ephemeral container that mounts the volume and compresses it.
    docker run --rm \
        -v "${vol}:/data:ro" \
        -v "${BACKUP_DIR}:/backup" \
        alpine \
        sh -c "tar czf /backup/$out -C /data ."
done

echo "Backups in: $BACKUP_DIR"
