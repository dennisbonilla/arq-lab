# Stops an individual stack or a full phase.
#
# Usage:
#   .\stop.ps1 gitlab          # stops only GitLab
#   .\stop.ps1 monitoring
#   .\stop.ps1 daily           # stops the daily phase

param(
    [Parameter(Mandatory = $true)]
    [string]$Target
)

$Root = Split-Path $PSScriptRoot -Parent
$Stacks = @{
    "jenkins"    = "stacks\cicd\docker-compose.jenkins.yml"
    "sonarqube"  = "stacks\cicd\docker-compose.sonarqube.yml"
    "nexus"      = "stacks\cicd\docker-compose.nexus.yml"
    "selenium"   = "stacks\cicd\docker-compose.selenium.yml"
    "gitea"      = "stacks\cicd\git\docker-compose.gitea.yml"
    "gitlab"     = "stacks\cicd\git\docker-compose.gitlab.yml"
    "monitoring" = "stacks\monitoring\docker-compose.monitoring.yml"
    "dashboard"  = "stacks\management\docker-compose.dashboard.yml"
    "portainer"  = "stacks\management\docker-compose.portainer.yml"
    "data"       = "stacks\data\docker-compose.data.yml"
    "keycloak"   = "stacks\security\docker-compose.keycloak.yml"
    "vault"      = "stacks\security\docker-compose.vault.yml"
    "trivy"      = "stacks\security\docker-compose.trivy.yml"
    "networking" = "stacks\networking\docker-compose.networking.yml"
    "aem"        = "stacks\aem\docker-compose.aem.yml"
}
$Phases = @{
    "all" = @("jenkins", "sonarqube", "nexus", "selenium", "gitea", "gitlab", "monitoring", "dashboard", "portainer", "data", "keycloak", "vault", "trivy", "networking", "aem")
    "daily" = @("trivy", "data", "portainer", "dashboard", "monitoring", "gitea", "selenium", "nexus", "sonarqube", "jenkins")
    "aemmode" = @("aem", "data", "dashboard", "monitoring", "gitea", "selenium", "nexus", "sonarqube", "jenkins")
}

function Stop-Stack($name) {
    if (-not $Stacks.ContainsKey($name)) {
        Write-Host "Unknown stack: $name" -ForegroundColor Red
        return
    }
    $file = Join-Path $Root $Stacks[$name]
    Write-Host "Stopping $name ..." -ForegroundColor Cyan
    docker compose -f $file down
}

if ($Phases.ContainsKey($Target)) {
    foreach ($s in $Phases[$Target]) { Stop-Stack $s }
} else {
    Stop-Stack $Target
}