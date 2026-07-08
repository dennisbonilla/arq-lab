# Creates the lab's shared network (idempotent: doesn't fail if it already exists).
$Network = "devops-net-jenkins-and-docker"

$exists = docker network ls --filter "name=^$Network$" --format "{{.Name}}"
if ($exists -eq $Network) {
    Write-Host "Network '$Network' already exists." -ForegroundColor Yellow
} else {
    docker network create $Network | Out-Null
    Write-Host "Network '$Network' created." -ForegroundColor Green
}