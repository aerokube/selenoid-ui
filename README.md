# Selenoid UI
[![Build Status](https://travis-ci.org/lanwen/selenoid-ui.svg?branch=master)](https://travis-ci.org/lanwen/selenoid-ui)
[![Coverage](https://codecov.io/github/lanwen/selenoid-ui/coverage.svg)](https://codecov.io/gh/lanwen/selenoid-ui)

Simple status page with UI updates by SSE,
backed by constant polling of status handle
of [selenoid](https://github.com/aandryashin/selenoid) on small go backend.

![status](docs/img/ui.png)

## Building

1) Download dependencies via [govendor](https://github.com/kardianos/govendor):
```
$ govendor sync
```
2) Generate static resources (assumed you have `yarn` installed):
```
$ go generate ./web ./...
```
3) Build:
```
$ go build
```

To build Docker container type:
```
$ GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build
$ docker build -t selenoid-ui:latest .
```
