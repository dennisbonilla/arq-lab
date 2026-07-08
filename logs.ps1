# Shows a container's logs live.
#
# Usage:
#   .\logs.ps1 jenkins-local
#   .\logs.ps1 prometheus

param(
    [Parameter(Mandatory = $true)]
    [string]$Container
)

docker logs -f $Container