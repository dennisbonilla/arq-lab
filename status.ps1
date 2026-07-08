# Shows the lab status: containers and network.

$Network = "devops-net-jenkins-and-docker"

Write-Host "`n=== Containers ===" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n=== Containers on the '$Network' network ===" -ForegroundColor Cyan
$net = docker network inspect $Network 2>$null
if ($LASTEXITCODE -eq 0) {
    docker network inspect $Network --format '{{range .Containers}}{{.Name}} {{end}}'
} else {
    Write-Host "The '$Network' network doesn't exist yet. Run network.ps1." -ForegroundColor Yellow
}

Write-Host "`n=== Resource usage ===" -ForegroundColor Cyan
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"