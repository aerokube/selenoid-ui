package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/aerokube/selenoid-ui/selenoid"
	"github.com/aerokube/util/sse"
	"github.com/koding/websocketproxy"
	"github.com/rakyll/statik/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	_ "github.com/aerokube/selenoid-ui/statik"
)

//go:generate statik -src=./ui/build -f

var (
	listen        string
	selenoidUri   string
	allowedOrigin string
	timeout       time.Duration
	period        time.Duration

	startTime = time.Now()

	version     bool
	gitRevision = "HEAD"
	buildStamp  = "unknown"
)

func mux(sse *sse.SseBroker) http.Handler {
	mux := http.NewServeMux()

	if statik, err := fs.New(); err == nil {
		static := http.FileServer(statik)
		mux.Handle("/", static)
	}

	mux.Handle("/events", sse)

	parsedUri, err := url.Parse(selenoidUri)
	if err != nil {
		log.Fatal(err)
	}

	mux.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = strings.TrimPrefix(r.URL.Path, "/ws")
		ws := &url.URL{Scheme: "ws", Host: parsedUri.Host, Path: r.URL.Path}
		log.Printf("[WS_PROXY] [/ws%s] [%s]", r.URL.Path, ws)
		wsProxy := websocketproxy.NewProxy(ws)

		if allowedOrigin != "" {
			upgrader := websocketproxy.DefaultUpgrader
			upgrader.CheckOrigin = checkOrigin(allowedOrigin)
		}
		wsProxy.ServeHTTP(w, r)
		log.Printf("[WS_PROXY] [%s] [CLOSED]", r.URL.Path)
	})


	mux.HandleFunc("/ping", ping)
	mux.HandleFunc("/status", status)
	mux.HandleFunc("/video/", video)
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

func status(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	status, err := selenoid.Status(req.Context(), selenoidUri)
	if err != nil {
		log.Printf("can't get status (%s)\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "errors": [{"msg": "can't get status"}] }`))
		return
	}

	w.Write(status)
}

func video(w http.ResponseWriter, req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/video")
	log.Printf("[PROXY_VID] [/video%s]", req.URL.Path)


	vid, err := selenoid.Video(req.Context(), selenoidUri,req.URL.Path)
	if err != nil {
		log.Printf("can't get status (%s)\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "errors": [{"msg": "can't get video"}] }`))
		return
	}


	w.Write(vid)
}

func showVersion() {
	fmt.Printf("Git Revision: %s\n", gitRevision)
	fmt.Printf("UTC Build Time: %s\n", buildStamp)
}

func init() {
	flag.StringVar(&listen, "listen", ":8080", "host and port to listen on")
	flag.StringVar(&selenoidUri, "selenoid-uri", "http://localhost:4444", "selenoid uri to fetch data from")
	flag.StringVar(&allowedOrigin, "allowed-origin", "", "comma separated list of allowed Origin headers (use * to allow all)")
	flag.DurationVar(&timeout, "timeout", 3*time.Second, "response timeout, e.g. 5s or 1m")
	flag.DurationVar(&period, "period", 5*time.Second, "data refresh period, e.g. 5s or 1m")
	flag.BoolVar(&version, "version", false, "Show version and exit")
	flag.Parse()

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
		status, err := selenoid.Status(timedCtx, selenoidUri)
		if err != nil {
			log.Printf("can't get status (%s)\n", err)
			br.Notify([]byte(`{ "errors": [{"msg": "can't get status"}] }`))
			return
		}
		br.Notify(status)
	}, period, stop)

	log.Printf("Listening on %s\n", listen)
	log.Fatal(http.ListenAndServe(listen, mux(broker)))
}
