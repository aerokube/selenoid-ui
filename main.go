package main

import (
	"net/http"
	"log"
	"time"
	"io/ioutil"
	"context"
)

//go:generate go-bindata-assetfs data/

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

func main() {
	selenoidUri := "http://localhost:4444"
	listen := ":8080"
	period := 5

	broker := NewSseBroker()
	go func() {
		for {
			ctx, _ := context.WithTimeout(context.Background(), 1*time.Second)

			res, err := Status(ctx, selenoidUri)
			if err != nil {
				log.Printf("can't get status (%s)\n", err)
				continue
			}
			broker.Notifier <- res
			time.Sleep(time.Second * time.Duration(period))
		}
	}()

	log.Printf("Listening on %s\n", listen)
	log.Fatal(http.ListenAndServe(listen, mux(broker)))
}
