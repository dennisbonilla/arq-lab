# Instructions.
## Starting the container.

docker compose up -d
docker compose -f docker-compose.sonarqube.yml up -d

## A Linux requirement that often causes trouble

SonarQube uses Elasticsearch internally, which requires a minimum value of vm.max_map_count on the host. If the container crashes on startup (check with docker logs sonarqube), this is almost certainly the cause. The fix on the Linux host:

sudo sysctl -w vm.max_map_count=524288

To make it permanent, add it to /etc/sysctl.conf. On Docker Desktop for Windows (which is your case, since you work on Windows with WSL2 behind the scenes) this is usually already configured, but if you see the container restarting in a loop, that's the first suspect.

## Useful commands.

docker compose logs -f sonarqube   # watch the startup (takes 1-2 min the first time)
docker compose stop
docker compose start
docker compose down                # stop and remove containers (volumes persist)
