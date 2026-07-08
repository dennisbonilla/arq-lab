# Instructions.
## Starting the container.

docker compose up -d # docker-compose.yml with this file name.

docker compose -f docker-compose.jenkins.yml up -d # if the file has a compound name, e.g. .jenkins.yml


## Useful commands.

docker stop jenkins      # stop
docker start jenkins     # start
docker restart jenkins   # restart
docker logs -f jenkins   # view live logs
docker rm -f jenkins     # remove the container (the volume persists)

If a file is used

docker compose -f docker-compose.jenkins.yml up -d      # start / recreate
docker compose -f docker-compose.jenkins.yml down       # stop and remove
docker compose -f docker-compose.jenkins.yml stop       # stop only
docker compose -f docker-compose.jenkins.yml logs -f    # view logs
