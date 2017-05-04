FROM scratch
MAINTAINER Kirill Merkushev <lanwen@yandex.ru>

COPY dist/selenoid-ui_linux_amd64 /selenoid-ui

EXPOSE 8080
ENTRYPOINT ["/selenoid-ui"]
