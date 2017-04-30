# Selenoid UI
[![Build Status](https://travis-ci.org/aerokube/selenoid-ui.svg?branch=master)](https://travis-ci.org/aerokube/selenoid-ui)
[![Coverage](https://codecov.io/github/aerokube/selenoid-ui/coverage.svg)](https://codecov.io/gh/aerokube/selenoid-ui)
[![Docker](https://img.shields.io/badge/docker-aerokube%2Fselenoid--ui-blue.svg)](https://hub.docker.com/r/aerokube/selenoid-ui/)

Simple status page with UI updates by SSE,
backed by constant polling of status handle
of [selenoid](https://github.com/aerokube/selenoid) on small go backend.

![ui](docs/img/ui.png)

![ui](docs/img/ui.gif)


## Usage

We distribute UI as a lightweight [Docker](http://docker.com/) container. To run it type:
```
$ docker run -d --name selenoid-ui --net host aerokube/selenoid-ui
```
Then access the UI on port 8080:
```
http://localhost:8080/
```
The following flags are supported:

- ```--listen``` - host and port to listen (e.g. ```:1234```)
- ```--period``` - data refresh period (e.g. ```5s``` or ```1m```)
- ```--selenoid-uri``` - selenoid uri to fetch data from (e.g. ```http://localhost:4444/```)

## Development

1) Ensure you have [yarn](https://github.com/yarnpkg/yarn) and [go-bindata-assetfs](https://github.com/elazarl/go-bindata-assetfs) installed

2) Generate static resources:
```
$ go generate ./web ./...
```
3) Build:
```
$ go build
```
4) To build Docker container type:
```
$ GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build
$ docker build -t selenoid-ui:latest .
```
