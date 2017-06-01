package sse

import (
	"bufio"
	"fmt"
	. "github.com/aandryashin/matchers"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

var (
	srv    *httptest.Server
	broker = NewSseBroker()
)

func init() {
	mux := http.NewServeMux()
	mux.Handle("/events", broker)
	srv = httptest.NewServer(mux)
}

func TestEvents(t *testing.T) {
	const testData = "test-data"
	ch := make(chan string)
	errors := make(chan error)
	go waitForMessage(srv.URL+"/events", ch, errors)
	stop := make(chan struct{})
	connected := make(chan struct{})
	go waitForConnection(broker, connected, stop)

	select {
	case <-connected:
		{
			broker.Notify([]byte(testData))

			select {
			case text := <-ch:
				{
					AssertThat(t, strings.TrimSpace(text), EqualTo{fmt.Sprintf("data: %s", testData)})
				}
			case err := <-errors:
				{
					t.Fatalf("Failed to receive message: %v", err)
				}
			}
		}
	case <-time.After(100 * time.Millisecond):
		{
			close(stop)
			t.Fatal("Test timed out")
		}
	}
}

func waitForConnection(broker *SseBroker, connected chan struct{}, stop chan struct{}) {
	for {
		select {
		case <-time.After(10 * time.Millisecond):
			if broker.HasClients() {
				connected <- struct{}{}
			}
		case <-stop:
			return
		}
	}
}

func waitForMessage(url string, ch chan string, errors chan error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		errors <- err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		errors <- err
	}
	defer resp.Body.Close()
	br := bufio.NewReader(resp.Body)
	const delim = '\n'
	for {
		data, err := br.ReadBytes(delim)
		if err != nil {
			break
		}

		if err == io.EOF {
			break
		}
		ch <- string(data)
	}
}
