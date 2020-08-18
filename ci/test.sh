#!/bin/bash

yarn --cwd ui install
yarn --cwd ui build
yarn --cwd ui test

export GO111MODULE="on"
go get -u github.com/rakyll/statik
go generate github.com/aerokube/selenoid-ui
go test -race -v -coverprofile=coverage.txt -covermode=atomic ./...
