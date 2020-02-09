FROM scratch
MAINTAINER Kirill Merkushev <lanwen@yandex.ru>

COPY selenoid-ui /
COPY health-check /
COPY licenses /

HEALTHCHECK --interval=30s --timeout=2s --start-period=2s --retries=2 CMD [ "/health-check" ]
EXPOSE 8080
ENTRYPOINT ["/selenoid-ui"]
