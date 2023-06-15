#!/bin/bash

yarn --cwd ui install
yarn --cwd ui build
yarn --cwd ui test

export GO111MODULE="on"
go install github.com/rakyll/statik@latest
go generate github.com/aerokube/selenoid-ui
go test -race -v -coverprofile=coverage.txt -covermode=atomic ./...

go install golang.org/x/vuln/cmd/govulncheck@latest
"$(go env GOPATH)"/bin/govulncheck ./...
