package selenoid

import (
	"testing"
	"encoding/json"
	. "github.com/aandryashin/matchers"
	"net/http/httptest"
	"net/http"
	"context"
)

var (
	srv  *httptest.Server
)

func init() {
	srv = httptest.NewServer(mockSelenoid())
}

func mockSelenoid() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc(statusPath, mockStatus)
	return mux
}

func mockStatus(w http.ResponseWriter, _ *http.Request) {
	data, _ := json.MarshalIndent(getTestState(), "", " ")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func TestToUI(t *testing.T) {
	ui := toUI(getTestState(), "http://localhost")
	data, err := json.MarshalIndent(ui, "", " ")
	AssertThat(t, err, Is{nil})
	AssertThat(t, data, Is{Not{nil}})
	AssertThat(t, ui.Browsers["firefox"], Is{1})
	AssertThat(t, ui.Browsers["chrome"], Is{1})
	AssertThat(t, ui.Browsers["opera"], Is{0})
}

func TestStatus(t *testing.T) {
	data, err := Status(context.Background(), srv.URL)
	AssertThat(t, err, Is{nil})
	AssertThat(t, data, Is{Not{nil}})
}

func getTestState() State {
	var state State
	json.Unmarshal([]byte(`{
  "total": 20,
  "used": 2,
  "queued": 0,
  "pending": 0,
  "browsers": {
    "chrome": {
      "58.0": {
        "unknown": {
          "count": 1,
          "sessions": [
            {
              "id": "5ad7e24dd38f7283163d839cae5e7e70",
              "vnc": false,
              "screen": "1920x1080x24"
            }
          ]
        }
      }
    },
    "firefox": {
      "52.0": {
        "unknown": {
          "count": 1,
          "sessions": [
            {
              "id": "87cffbdd-8b63-46a5-ba65-6f2d32d40304",
              "vnc": false,
              "screen": "1920x1080x24"
            }
          ]
        }
      }
    },
    "opera": {
      "44.0": {}
    }
  }
}`), &state)
	return state
}
