package main

import (
	. "github.com/aandryashin/matchers"
	. "github.com/aandryashin/matchers/httpresp"
	"github.com/aerokube/util/sse"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRootLoads(t *testing.T) {
	broker := sse.NewSseBroker()
	srv := httptest.NewServer(mux(broker))
	resp, err := http.Get(srv.URL + "/")
	AssertThat(t, err, Is{nil})
	AssertThat(t, resp, Code{200})
}
