#!/bin/bash
set -e

docker-compose -f docker-compose-build.yml rm -f
go generate ./ui ./...
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build 
docker-compose -f docker-compose-build.yml up --build