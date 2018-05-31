package main

import (
	"encoding/json"
	. "github.com/aandryashin/matchers"
	. "github.com/aandryashin/matchers/httpresp"
	"github.com/aerokube/util/sse"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

var (
	srv *httptest.Server
)

func init() {
	broker := sse.NewSseBroker()
	srv = httptest.NewServer(mux(broker))
	gitRevision = "test-revision"
}

func withUrl(path string) string {
	return srv.URL + path
}

func TestRootLoads(t *testing.T) {
	resp, err := http.Get(withUrl("/"))
	AssertThat(t, err, Is{nil})
	AssertThat(t, resp, Code{200})
}

func TestPing(t *testing.T) {
	rsp, err := http.Get(withUrl("/ping"))

	AssertThat(t, err, Is{nil})
	AssertThat(t, rsp, Code{http.StatusOK})
	AssertThat(t, rsp.Body, Is{Not{nil}})

	var data map[string]interface{}
	bt, readErr := ioutil.ReadAll(rsp.Body)
	AssertThat(t, readErr, Is{nil})
	jsonErr := json.Unmarshal(bt, &data)
	AssertThat(t, jsonErr, Is{nil})
	_, hasUptime := data["uptime"]
	AssertThat(t, hasUptime, Is{true})
	version, hasVersion := data["version"]
	AssertThat(t, hasVersion, Is{true})
	AssertThat(t, version, EqualTo{"test-revision"})
}
