# Backs up the Docker volumes to .tar.gz files in shared/backups/.
#
# Usage:
#   .\backup.ps1                 # backs up a predefined list
#   .\backup.ps1 jenkins_home    # backs up a specific volume

param(
    [string]$Volume = ""
)

$Root = Split-Path $PSScriptRoot -Parent
$BackupDir = Join-Path $Root "shared\backups"
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Volumes backed up by default.
$Defaults = @(
    "jenkins_home", "nexus_data", "gitea_data", "grafana_data",
    "prometheus_data", "loki_data", "portainer_data", "postgres_data"
)

$targets = if ($Volume -ne "") { @($Volume) } else { $Defaults }

foreach ($vol in $targets) {
    $exists = docker volume ls --filter "name=^$vol$" --format "{{.Name}}"
    if ($exists -ne $vol) {
        Write-Host "Volume '$vol' not found, skipping." -ForegroundColor Yellow
        continue
    }
    $out = "$vol-$stamp.tar.gz"
    Write-Host "Backing up $vol -> $out" -ForegroundColor Cyan
    # Ephemeral container that mounts the volume and compresses it.
    docker run --rm `
        -v "${vol}:/data:ro" `
        -v "${BackupDir}:/backup" `
        alpine `
        sh -c "tar czf /backup/$out -C /data ."
}

Write-Host "Backups in: $BackupDir" -ForegroundColor Green