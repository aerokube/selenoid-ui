#!/usr/bin/env bash

set -e

# Docker Hub image
docker build -t $GITHUB_REPOSITORY .
docker tag $GITHUB_REPOSITORY $GITHUB_REPOSITORY:$1
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker push $GITHUB_REPOSITORY
docker push $GITHUB_REPOSITORY:$1

# quay.io image
docker build -f quay/Dockerfile -t quay.io/$GITHUB_REPOSITORY .
docker tag quay.io/$GITHUB_REPOSITORY quay.io/$GITHUB_REPOSITORY:$1
docker login -u="$QUAY_USERNAME" -p="$QUAY_PASSWORD" quay.io
docker push quay.io/$GITHUB_REPOSITORY
docker push quay.io/$GITHUB_REPOSITORY:$1
