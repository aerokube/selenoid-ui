#!/bin/bash

set -x

export GO111MODULE="on"
go install github.com/mitchellh/gox@latest # cross compile
gox -os "linux darwin windows" -arch "amd64" -osarch="darwin/arm64" -osarch="windows/386" -output "dist/{{.Dir}}_{{.OS}}_{{.Arch}}" -ldflags "-X main.buildStamp=`date -u '+%Y-%m-%d_%I:%M:%S%p'` -X main.gitRevision=`git describe --tags || git rev-parse HEAD`"
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags "-X main.buildStamp=`date -u '+%Y-%m-%d_%I:%M:%S%p'` -X main.gitRevision=`git describe --tags || git rev-parse HEAD`" # for docker
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o health-check healthcheck/main.go

mkdir -p licenses
yarn --cwd ui licenses generate-disclaimer > licenses/ui-licenses
cd $(go env GOPATH)/pkg/mod
find . -name 'LICENSE*' -exec cp --parents \{\} ${GITHUB_WORKSPACE}/licenses \;
cd ${GITHUB_WORKSPACE}
