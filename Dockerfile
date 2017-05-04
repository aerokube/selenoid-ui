FROM ubuntu
MAINTAINER Kirill Merkushev <lanwen@yandex.ru>

COPY selenoid-ui /

EXPOSE 8080
CMD ["/selenoid-ui"]
