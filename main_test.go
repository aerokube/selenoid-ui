package main

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	. "github.com/aandryashin/matchers"
	. "github.com/aandryashin/matchers/httpresp"
)

var (
	srv *httptest.Server
)

var _ = func() bool {
	testing.Init()
	return true
}()

func init() {
	srv = httptest.NewServer(mux())
	gitRevision = "test-revision"
}

func selenoidApi() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/status", mockStatus)
	return mux
}
func mockStatus(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{
  "total": 5,
  "used": 0,
  "queued": 0,
  "pending": 0,
  "browsers": {
    "firefox": {
      "61.0": {
        
      }
    }
  },
	"videos":["test_chrome.mp4"]
	
}`))
}

func videoApi() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/video/", mockVideo)
	return mux
}

func mockVideo(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("im a video"))
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
	bt, readErr := io.ReadAll(rsp.Body)
	AssertThat(t, readErr, Is{nil})
	jsonErr := json.Unmarshal(bt, &data)
	AssertThat(t, jsonErr, Is{nil})
	_, hasUptime := data["uptime"]
	AssertThat(t, hasUptime, Is{true})
	version, hasVersion := data["version"]
	AssertThat(t, hasVersion, Is{true})
	AssertThat(t, version, EqualTo{"test-revision"})
}

func TestStatus(t *testing.T) {
	selenoid := httptest.NewServer(selenoidApi())
	statusURI, _ = url.Parse(selenoid.URL)
	rsp, err := http.Get(withUrl("/status"))

	AssertThat(t, err, Is{nil})
	AssertThat(t, rsp, Code{http.StatusOK})
	AssertThat(t, rsp.Body, Is{Not{nil}})
	AssertThat(t, rsp.Header.Get("Content-Type"), Is{"application/json"})
}

func TestVideo(t *testing.T) {
	video := httptest.NewServer(videoApi())
	statusURI, _ = url.Parse(video.URL)
	rsp, err := http.Get(withUrl("/video/test_chrome.mp4"))

	AssertThat(t, err, Is{nil})
	AssertThat(t, rsp, Code{http.StatusOK})
	AssertThat(t, rsp.Body, Is{Not{nil}})
}

func TestVideoFail(t *testing.T) {
	statusURI, _ = url.Parse("http://localhost:1")
	rsp, err := http.Get(withUrl("/video/test_chrome1.mp4"))

	AssertThat(t, err, Is{nil})
	AssertThat(t, rsp, Code{http.StatusBadGateway})
	AssertThat(t, rsp.Body, Not{Is{nil}})
}

func TestStatusError(t *testing.T) {
	statusURI, _ = url.Parse("http://localhost:1")
	rsp, err := http.Get(withUrl("/status"))

	AssertThat(t, err, Is{nil})
	AssertThat(t, rsp, Code{http.StatusInternalServerError})
	AssertThat(t, rsp.Body, Is{Not{nil}})
	AssertThat(t, rsp.Header.Get("Content-Type"), Is{"application/json"})
}

func TestCheckOrigin(t *testing.T) {
	r, _ := http.NewRequest(http.MethodGet, "http://localhost", nil)
	r.Header.Add("Origin", "some-host.example.com")
	AssertThat(t, checkOrigin("*")(r), Is{true})
	AssertThat(t, checkOrigin("some-host.example.com,another-host.example.com")(r), Is{true})
	AssertThat(t, checkOrigin("missing-host.example.com,another-host.example.com")(r), Is{false})
}
