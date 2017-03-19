package main

import (
	"context"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

//go:generate go-bindata-assetfs data/

var (
	listen      string
	selenoidUri string
	period      time.Duration
)

func httpDo(ctx context.Context, req *http.Request, handle func(*http.Response, error) error) error {
	// Run the HTTP request in a goroutine and pass the response to handle function
	errChan := make(chan error, 1)
	go func() {
		errChan <- handle(http.DefaultClient.Do(req.WithContext(ctx)))
	}()
	select {
	case <-ctx.Done():
		<-errChan // Wait for handle to return.
		return ctx.Err()
	case err := <-errChan:
		return err
	}
}

func Status(ctx context.Context, baseUrl string) ([]byte, error) {
	req, err := http.NewRequest("GET", baseUrl+"/status", nil)
	if err != nil {
		return nil, err
	}

	var results []byte
	err = httpDo(ctx, req, func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		results, err = ioutil.ReadAll(resp.Body)
		return err
	})
	return results, err
}

func mux(sse *SseBroker) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(assetFS()))
	mux.Handle("/events", sse)
	return mux
}

func init() {
	flag.StringVar(&listen, "listen", ":8080", "host and port to listen on")
	flag.StringVar(&selenoidUri, "selenoidUri", "http://localhost:4444", "selenoid uri to fetch data from")
	flag.DurationVar(&period, "period", 5*time.Second, "data refresh period, e.g. 5s or 1m")
	flag.Parse()
}

func main() {
	broker := NewSseBroker()
	stop := make(chan os.Signal)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		ticker := time.NewTicker(period)
		for {
			ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
			select {
			case <-ticker.C:
				{
					if (broker.HasClients()) {
						res, err := Status(ctx, selenoidUri)
						if err != nil {
							log.Printf("can't get status (%s)\n", err)
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
