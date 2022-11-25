FROM golang:alpine as build
# Install CA-Certs
RUN apk --no-cache add ca-certificates

FROM scratch
MAINTAINER Kirill Merkushev <lanwen@yandex.ru>

COPY selenoid-ui /
COPY health-check /
COPY licenses /

# Copy CA-Certs from build to scratch image
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

HEALTHCHECK --interval=30s --timeout=2s --start-period=2s --retries=2 CMD [ "/health-check" ]
EXPOSE 8080
ENTRYPOINT ["/selenoid-ui"]
