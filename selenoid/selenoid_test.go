package selenoid

import (
	"testing"
	"encoding/json"
	. "github.com/aandryashin/matchers"
	"log"
)

func TestToUI(t *testing.T) {
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
	ui := toUI(state, "http://localhost")
	res, _ := json.MarshalIndent(ui, "", " ")
	log.Println(string(res))
	AssertThat(t, ui.Browsers["firefox"], Is{1})
	AssertThat(t, ui.Browsers["chrome"], Is{1})
	AssertThat(t, ui.Browsers["opera"], Is{0})
}

