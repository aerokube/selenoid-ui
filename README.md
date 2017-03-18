# Selenoid UI

## Building
1) Download dependencies via [govendor](https://github.com/kardianos/govendor):
```
$ govendor sync
```
2) Generate static resources:
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
