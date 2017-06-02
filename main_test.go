package main

import (
	"encoding/json"
	. "github.com/aandryashin/matchers"
	. "github.com/aandryashin/matchers/httpresp"
	"github.com/aerokube/selenoid-ui/selenoid"
	"github.com/aerokube/selenoid-ui/sse"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
	"strings"
	"fmt"
)

func TestRootLoads(t *testing.T) {
	broker := sse.NewSseBroker()
	srv := httptest.NewServer(mux(broker))
	resp, err := http.Get(srv.URL + "/")
	AssertThat(t, err, Is{nil})
	AssertThat(t, resp, Code{200})
}

func TestRegex(t *testing.T) {
	paths := []string{
		"/manifest.bundle.js",
		"/hljs.bundle.js",
		"/vendor.bundle.js",
		"/js.bundle.js",
		"/log/2j",
		"/log/js.bundle.js",
		"/log/manifest.bundle.js",
		"/vnc/2",
	}

	for _, path := range paths {
		AssertThat(t, staticRewrite(path), NotContains{"log"})
		AssertThat(t, staticRewrite(path), NotContains{"vnc"})
	}
}

type NotContains struct {
	V interface{}
}

func (m NotContains) Match(i interface{}) bool {
	return !strings.Contains(i.(string), m.V.(string))
}

func (m NotContains) String() string {
	return fmt.Sprintf("not contains %v", m.V)
}

type MockBroker struct {
	messages chan string
}

func (mb *MockBroker) HasClients() bool {
	return true
}

func (mb *MockBroker) Notify(data []byte) {
	mb.messages <- string(data)
}

func (mb *MockBroker) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	rw.WriteHeader(http.StatusOK)
}

func TestTick(t *testing.T) {
	srv := httptest.NewServer(selenoidApi())
	broker := &MockBroker{messages: make(chan string, 10)}
	stop := make(chan os.Signal)
	go tick(broker, srv.URL, 10*time.Millisecond, stop)
	time.Sleep(50 * time.Millisecond)
	close(stop)
	AssertThat(t, len(broker.messages) > 0, Is{true})
}

func selenoidApi() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/status", mockStatus)
	return mux
}

func mockStatus(w http.ResponseWriter, _ *http.Request) {
	data, _ := json.MarshalIndent(selenoid.State{}, "", " ")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
