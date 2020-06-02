package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/aerokube/selenoid-ui/selenoid"
	"github.com/aerokube/util/sse"
	"github.com/koding/websocketproxy"
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

func mux(sse *sse.SseBroker) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(statik))
	mux.Handle("/events", sse)
	mux.HandleFunc("/ws/", ws)
	mux.HandleFunc("/ping", ping)
	mux.HandleFunc("/status", status)
	mux.HandleFunc("/video/", func(w http.ResponseWriter, r *http.Request) {
		reverseProxy(statusURI).ServeHTTP(w, r)
	})
	mux.HandleFunc("/videos", func(w http.ResponseWriter, r *http.Request) {
		reverseProxy(statusURI).ServeHTTP(w, r)
	})
	mux.HandleFunc("/wd/hub/", func(w http.ResponseWriter, r *http.Request) {
		reverseProxy(webdriverURI).ServeHTTP(w, r)
	})
	return mux
}

func ws(w http.ResponseWriter, r *http.Request) {
	r.URL.Path = strings.TrimPrefix(r.URL.Path, "/ws")
	ws := &url.URL{Scheme: "ws", Host: statusURI.Host, Path: r.URL.Path}
	log.Printf("[WS_PROXY] [/ws%s] [%s]", r.URL.Path, ws)
	wsProxy := websocketproxy.NewProxy(ws)

	if allowedOrigin != "" {
		upgrader := websocketproxy.DefaultUpgrader
		upgrader.CheckOrigin = checkOrigin(allowedOrigin)
	}
	wsProxy.ServeHTTP(w, r)
	log.Printf("[WS_PROXY] [%s] [CLOSED]", r.URL.Path)
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

func status(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	v := gitRevision + "[" + buildStamp + "]"
	status, err := selenoid.Status(req.Context(), webdriverURI, statusURI, v)
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
	flag.DurationVar(&timeout, "timeout", 3*time.Second, "response timeout, e.g. 5s or 1m")
	flag.DurationVar(&period, "period", 5*time.Second, "data refresh period, e.g. 5s or 1m")
	flag.BoolVar(&version, "version", false, "Show version and exit")
	flag.Parse()

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

	if version {
		showVersion()
		os.Exit(0)
	}
}

func main() {
	broker := sse.NewSseBroker()
	stop := make(chan os.Signal)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	go sse.Tick(broker, func(ctx context.Context, br sse.Broker) {
		timedCtx, cancel := context.WithTimeout(ctx, timeout)
		defer cancel()
		status, err := selenoid.Status(timedCtx, webdriverURI, statusURI, gitRevision+"["+buildStamp+"]")
		if err != nil {
			log.Printf("[ERROR] [Can't get status: %v]", err)
			br.Notify([]byte(`{ "errors": [{"msg": "can't get status"}] }`))
			return
		}
		br.Notify(status)
	}, period, stop)

	log.Printf("[INIT] [Listening on %s]", listen)
	log.Fatal(http.ListenAndServe(listen, mux(broker)))
}
