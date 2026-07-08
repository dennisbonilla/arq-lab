# Starts an individual stack or a full phase.
#
# Usage:
#   .\start.ps1 jenkins        # a single service
#   .\start.ps1 monitoring     # the monitoring stack
#   .\start.ps1 daily          # the daily-work "phase" (several stacks)
#   .\start.ps1 aem            # AEM
#
# Adjust the paths if you move the files.

param(
    [Parameter(Mandatory = $true)]
    [string]$Target
)

# Ensure the network first.
& "$PSScriptRoot\network.ps1"

# Map: name -> compose file (relative to the repo root).
$Root = Split-Path $PSScriptRoot -Parent
$Stacks = @{
    "jenkins"    = "arq-lab\stacks\cicd\jenkins\docker-compose.jenkins.yml"
    "sonarqube"  = "arq-lab\stacks\cicd\sonarqube\docker-compose.sonarqube.yml"
    "nexus"      = "arq-lab\stacks\cicd\nexus\docker-compose.nexus.yml"
    "selenium"   = "arq-lab\stacks\cicd\selenium\docker-compose.selenium.yml"
    "gitea"      = "arq-lab\stacks\cicd\git\docker-compose.gitea.yml"
    "gitlab"     = "arq-lab\stacks\cicd\git\docker-compose.gitlab.yml"
    "monitoring" = "arq-lab\stacks\monitoring\docker-compose.monitoring.yml"
    "dashboard"  = "arq-lab\stacks\management\docker-compose.dashboard.yml"
    "portainer"  = "arq-lab\stacks\management\docker-compose.portainer.yml"
    "data"       = "arq-lab\stacks\data\docker-compose.data.yml"
    "keycloak"   = "arq-lab\stacks\security\docker-compose.keycloak.yml"
    "vault"      = "arq-lab\stacks\security\docker-compose.vault.yml"
    "trivy"      = "arq-lab\stacks\security\docker-compose.trivy.yml"
    "networking" = "arq-lab\stacks\networking\docker-compose.networking.yml"
    "aem"        = "arq-lab\stacks\aem65\docker-compose.aem65.yml"
}

# Phases: groupings of stacks.
$Phases = @{
    "all" = @("jenkins", "sonarqube", "nexus", "selenium", "gitea", "gitlab", "monitoring", "dashboard", "portainer", "data", "keycloak", "vault", "trivy", "networking", "aem")
    "daily" = @("jenkins", "sonarqube", "nexus", "selenium", "gitea", "monitoring", "dashboard", "portainer", "data", "trivy")
    "aemmode" = @("jenkins", "sonarqube", "nexus", "selenium", "gitea", "monitoring", "dashboard", "data", "aem")
}

function Start-Stack($name) {
    if (-not $Stacks.ContainsKey($name)) {
        Write-Host "Unknown stack: $name" -ForegroundColor Red
        return
    }
    $file = Join-Path $Root $Stacks[$name]
    Write-Host "Starting $name ..." -ForegroundColor Cyan
    docker compose -f $file up -d
}

if ($Phases.ContainsKey($Target)) {
    foreach ($s in $Phases[$Target]) { Start-Stack $s }
} else {
    Start-Stack $Target
}