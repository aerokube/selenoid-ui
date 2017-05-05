# Selenoid UI
[![Build Status](https://travis-ci.org/aerokube/selenoid-ui.svg?branch=master)](https://travis-ci.org/aerokube/selenoid-ui)
[![Coverage](https://codecov.io/github/aerokube/selenoid-ui/coverage.svg)](https://codecov.io/gh/aerokube/selenoid-ui)
[![Docker](https://img.shields.io/badge/docker-aerokube%2Fselenoid--ui-blue.svg)](https://hub.docker.com/r/aerokube/selenoid-ui/)
[![Release](https://img.shields.io/github/release/aerokube/selenoid-ui.svg)](https://github.com/aerokube/selenoid-ui/releases/latest)

Simple status page with UI updates by SSE,
backed by constant polling of status handle
of [selenoid](https://github.com/aerokube/selenoid) on small go backend.

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

## Features

### Stats

Shows current quota usage, pending browsers and queue.

![ui](docs/img/ui.png)

### VNC

If you get browser from selenoid with `enableVNC=true` capability, you can see list of available screens:

![ui](docs/img/vnc-list.png)

And interact with this browser:

![ui](docs/img/vnc.png)

Please refer to selenoid documentation about VNC usage.


## Development

1) Ensure you have [yarn](https://github.com/yarnpkg/yarn) and [go-bindata-assetfs](https://github.com/elazarl/go-bindata-assetfs) installed

 - For tests deps install `go get -u github.com/aandryashin/matchers`

2) Generate static resources:

```bash
$ go generate ./web ./...
```

3) Build:

```bash
$ go build
```

4) To build Docker container type:

```bash
$ GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build
$ docker build -t selenoid-ui:latest .
```
