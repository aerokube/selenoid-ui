package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/aerokube/selenoid-ui/selenoid"
	"github.com/aerokube/util/sse"
	"github.com/koding/websocketproxy"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

//go:generate go-bindata-assetfs data/...

var (
	listen      string
	selenoidUri string
	period      time.Duration

	startTime = time.Now()

	version     bool
	gitRevision = "HEAD"
	buildStamp  = "unknown"
)

func mux(sse *sse.SseBroker) http.Handler {
	mux := http.NewServeMux()
	static := http.FileServer(assetFS())

	mux.Handle("/", static)
	mux.Handle("/events", sse)

	parsedUri, err := url.Parse(selenoidUri)
	if err != nil {
		log.Fatal(err)
	}

	mux.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = strings.TrimPrefix(r.URL.Path, "/ws")
		ws := &url.URL{Scheme: "ws", Host: parsedUri.Host, Path: r.URL.Path}
		log.Printf("[WS_PROXY] [/ws%s] [%s]", r.URL.Path, ws)
		websocketproxy.NewProxy(ws).ServeHTTP(w, r)
		log.Printf("[WS_PROXY] [%s] [CLOSED]", r.URL.Path)
	})
	mux.HandleFunc("/ping", ping)
	mux.HandleFunc("/status", status)
	mux.HandleFunc("/webdriver/session", startSession)
	mux.HandleFunc("/webdriver/session/", stopSession)
	return mux
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


func startSession(w http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	w.Header().Add("Content-Type", "application/json")

	var caps selenoid.Caps
	json.NewDecoder(req.Body).Decode(&caps)

	sessionId, err := selenoid.StartSession(req.Context(), selenoidUri, caps)
	if err != nil {
		log.Printf("can't start new session (%s)\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"sessionId": "` + sessionId +`"}`))
}


func stopSession(w http.ResponseWriter, req *http.Request) {
	if req.Method != "DELETE" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	sessionId := strings.TrimPrefix(req.URL.Path, "/webdriver/session/")
	err := selenoid.StopSession(req.Context(), selenoidUri, sessionId)
	if err != nil {
		log.Printf("can't stop session (%s)\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func showVersion() {
	fmt.Printf("Git Revision: %s\n", gitRevision)
	fmt.Printf("UTC Build Time: %s\n", buildStamp)
}

func init() {
	flag.StringVar(&listen, "listen", ":8080", "host and port to listen on")
	flag.StringVar(&selenoidUri, "selenoid-uri", "http://localhost:4444", "selenoid uri to fetch data from")
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
		status, err := selenoid.Status(ctx, selenoidUri)
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
