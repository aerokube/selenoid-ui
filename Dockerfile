FROM scratch
MAINTAINER Kirill Merkushev <lanwen@yandex.ru>

COPY selenoid-ui /

EXPOSE 8080
ENTRYPOINT ["/selenoid-ui"]
