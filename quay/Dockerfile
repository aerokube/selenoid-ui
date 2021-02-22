FROM registry.access.redhat.com/ubi8/ubi-minimal

RUN update-ca-trust

ADD selenoid-ui /

ADD licenses /

EXPOSE 8080
ENTRYPOINT ["/selenoid-ui"]
