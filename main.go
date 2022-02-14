package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"time"

	auth "github.com/abbot/go-http-auth"
	"github.com/aerokube/selenoid-ui/selenoid"
	"github.com/rakyll/statik/fs"

	_ "github.com/aerokube/selenoid-ui/statik"
)

//go:generate statik -src=./ui/build

var (
	listen             string
	selenoidUri        string
	webdriverUriString string
	statusUriString    string
	allowedOrigin      string
	users              string
	timeout            time.Duration
	period             time.Duration

	startTime = time.Now()

	statik       http.FileSystem
	webdriverURI *url.URL
	statusURI    *url.URL

	version     bool
	gitRevision = "HEAD"
	buildStamp  = "unknown"
)

func mux() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(statik))
	mux.HandleFunc("/events", sse)
	mux.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = strings.TrimPrefix(r.URL.Path, "/ws")
		reverseProxy(webdriverURI).ServeHTTP(w, r)
	})
	mux.HandleFunc("/ping", ping)
	mux.HandleFunc("/status", status)
	mux.HandleFunc("/video/", func(w http.ResponseWriter, r *http.Request) {
		reverseProxy(statusURI).ServeHTTP(w, r)
	})
	mux.HandleFunc("/wd/hub/", func(w http.ResponseWriter, r *http.Request) {
		reverseProxy(webdriverURI).ServeHTTP(w, r)
	})
	return mux
}

func checkOrigin(allowedOrigins string) func(r *http.Request) bool {
	if allowedOrigins == "*" {
		return func(r *http.Request) bool {
			return true
		}
	}
	originsList := strings.Split(allowedOrigins, ",")
	return func(r *http.Request) bool {
		origin := r.Header["Origin"]
		if len(origin) == 0 {
			return true
		}
		for _, o := range originsList {
			if origin[0] == o {
				return true
			}
		}
		return false
	}
}

func ping(w http.ResponseWriter, _ *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		Uptime  string `json:"uptime"`
		Version string `json:"version"`
	}{time.Since(startTime).String(), gitRevision})
}

type SSEError struct {
	Msg string `json:"msg"`
}

func status(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	v := gitRevision + "[" + buildStamp + "]"
	status, err := selenoid.Status(r.Context(), r.Header, webdriverURI, statusURI, v)
	if err != nil {
		log.Printf("[ERROR] [Can't get status: %v]", err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(struct {
			Errors  []SSEError `json:"errors"`
			Version string     `json:"version"`
		}{Errors: []SSEError{{Msg: "can't get status"}}, Version: v})

		return
	}

	w.Write(status)
}

func sse(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	v := gitRevision + "[" + buildStamp + "]"

	for {
		select {
		case <-r.Context().Done():
			return
		case <-time.After(period):
			status, err := selenoid.Status(r.Context(), r.Header, webdriverURI, statusURI, v)
			if err != nil {
				if errors.Is(err, context.Canceled) {
					return
				}
				log.Printf("[STATUS_ERROR] [get status: %v]", err)
				fmt.Fprint(w, []byte(`{ "errors": [{"msg": "can't get status"}] }`))
				return
			}
			if err != nil {
				log.Printf("[STATUS_ERROR] [marshal status: %v]", err)
				fmt.Fprint(w, []byte(`{ "errors": [{"msg": "can't marshal status"}] }`))
				return
			}
			_, err = fmt.Fprintf(w, "data: %s\n\n", status)
			if err != nil {
				log.Printf("[STATUS_ERROR] [write status: %v]", err)
				fmt.Fprint(w, []byte(`{ "errors": [{"msg": "can't marshal status"}] }`))
				return
			}
			flusher.Flush()
		}
	}
}

func reverseProxy(u *url.URL) http.Handler {
	rp := httputil.NewSingleHostReverseProxy(u)
	rp.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("[ERROR] [Failed to proxy to %s: %v]", r.URL.String(), err)
		w.WriteHeader(http.StatusBadGateway)
	}
	return rp
}

func showVersion() {
	fmt.Printf("Git Revision: %s\n", gitRevision)
	fmt.Printf("UTC Build Time: %s\n", buildStamp)
}

func init() {
	flag.StringVar(&listen, "listen", ":8080", "host and port to listen on")
	flag.StringVar(&selenoidUri, "selenoid-uri", "http://localhost:4444", "selenoid uri to fetch data from")
	flag.StringVar(&webdriverUriString, "webdriver-uri", "", "webdriver uri used to create new sessions")
	flag.StringVar(&statusUriString, "status-uri", "", "status uri to fetch data from")
	flag.StringVar(&allowedOrigin, "allowed-origin", "", "comma separated list of allowed Origin headers (use * to allow all)")
	flag.StringVar(&users, "users", "", "htpasswd file path containing users information")
	flag.DurationVar(&timeout, "timeout", 3*time.Second, "response timeout, e.g. 5s or 1m")
	flag.DurationVar(&period, "period", 5*time.Second, "data refresh period, e.g. 5s or 1m")
	flag.BoolVar(&version, "version", false, "Show version and exit")
	flag.Parse()

	if version {
		showVersion()
		os.Exit(0)
	}

	if webdriverUriString == "" {
		webdriverUriString = selenoidUri
	}
	if statusUriString == "" {
		statusUriString = selenoidUri
	}

	st, err := fs.New()
	if err != nil {
		log.Fatalf("[INIT] [Missing static content: %v]", err)
	}
	statik = st

	su, err := url.Parse(statusUriString)
	if err != nil {
		log.Fatalf("[INIT] [Invalid status URI: %v]", err)
	}
	statusURI = su

	wu, err := url.Parse(webdriverUriString)
	if err != nil {
		log.Fatalf("[INIT] [Invalid WebDriver URI: %v]", err)
	}
	webdriverURI = wu

	if _, err := os.Stat(users); users != "" && err != nil {
		log.Fatalf("[INIT] [Invalid users file: %v]", err)
	}
}

func main() {
	mux := mux()
	if users != "" {
		log.Printf("[INIT] [Reading users from %s]", users)
		authenticator := auth.NewBasicAuthenticator(
			"Selenoid UI",
			auth.HtpasswdFileProvider(users),
		)
		mux = auth.JustCheck(authenticator, mux.ServeHTTP)
	}
	log.Printf("[INIT] [Listening on %s]", listen)
	log.Fatal(http.ListenAndServe(listen, mux))
}
