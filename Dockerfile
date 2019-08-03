FROM scratch
MAINTAINER Kirill Merkushev <lanwen@yandex.ru>

COPY selenoid-ui /
COPY licenses /

EXPOSE 8080
ENTRYPOINT ["/selenoid-ui"]
