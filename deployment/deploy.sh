#!/bin/bash

cp /root/pp/.env.travel-map-fe ./.env

docker compose -f ./deployment/docker-compose.yml build
docker compose -f ./deployment/docker-compose.yml up --detach
