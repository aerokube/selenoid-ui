package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"github.com/aerokube/selenoid-ui/selenoid"
	"github.com/aerokube/selenoid-ui/sse"
)

//go:generate go-bindata-assetfs data/

var (
	listen      string
	selenoidUri string
	period      time.Duration
)

func mux(sse *sse.SseBroker) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(assetFS()))
	mux.Handle("/events", sse)
	return mux
}

func init() {
	flag.StringVar(&listen, "listen", ":8080", "host and port to listen on")
	flag.StringVar(&selenoidUri, "selenoid-uri", "http://localhost:4444", "selenoid uri to fetch data from")
	flag.DurationVar(&period, "period", 5*time.Second, "data refresh period, e.g. 5s or 1m")
	flag.Parse()
}

func main() {
	broker := sse.NewSseBroker()
	stop := make(chan os.Signal)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		ticker := time.NewTicker(period)
		for {
			ctx, cancel := context.WithCancel(context.Background())
			select {
			case <-ticker.C:
				{
					if broker.HasClients() {
						res, err := selenoid.Status(ctx, selenoidUri)
						if err != nil {
							log.Printf("can't get status (%s)\n", err)
							broker.Notifier <- []byte(`{ "errors": [{"msg": "can't get status"}] }`)
							continue
						}
						broker.Notifier <- res
					}
				}
			case <-stop:
				{
					cancel()
					ticker.Stop()
					os.Exit(0)
				}
			}
		}
	}()

	log.Printf("Listening on %s\n", listen)
	log.Fatal(http.ListenAndServe(listen, mux(broker)))
}
