#!/usr/bin/env bash

set -e

docker build -f Dockerfile -t quay.io/$GITHUB_REPOSITORY -t quay.io/$GITHUB_REPOSITORY:$1 .
docker login -u="$QUAY_USERNAME" -p="$QUAY_PASSWORD" quay.io
docker push quay.io/$GITHUB_REPOSITORY
docker push quay.io/$GITHUB_REPOSITORY:$1
