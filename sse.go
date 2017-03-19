package main

import (
	"net/http"
	"fmt"
	"log"
	"time"
)

// the amount of time to wait when pushing a message to
// a slow client or a client that closed after `range clients` started.
const patience time.Duration = time.Second * 1

type SseBroker struct {
	// Events are pushed to this channel
	Notifier chan []byte

	// New client connections
	newClients chan chan []byte

	// Closed client connections
	closingClients chan chan []byte

	// Client connections registry
	clients map[chan []byte]bool
}

func NewSseBroker() (broker *SseBroker) {
	broker = &SseBroker{
		Notifier:       make(chan []byte, 1),
		newClients:     make(chan chan []byte),
		closingClients: make(chan chan []byte),
		clients:        make(map[chan []byte]bool),
	}

	go broker.listen()

	return broker
}

func (sse *SseBroker) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	flusher, ok := rw.(http.Flusher)
	if !ok {
		http.Error(rw, "Streaming unsupported!", http.StatusInternalServerError)
		return
	}

	rw.Header().Set("Content-Type", "text/event-stream")
	rw.Header().Set("Cache-Control", "no-cache")
	rw.Header().Set("Connection", "keep-alive")
	rw.Header().Set("Access-Control-Allow-Origin", "*")

	messageChan := make(chan []byte)
	sse.newClients <- messageChan
	defer func() {
		sse.closingClients <- messageChan
	}()

	for {
		select {
		case <-rw.(http.CloseNotifier).CloseNotify():
			return
		default:
			fmt.Fprintf(rw, "data: %s\n\n", <-messageChan)
			flusher.Flush()
		}
	}

}

func (sse *SseBroker) HasClients() bool {
	return len(sse.clients) > 0
}

func (broker *SseBroker) listen() {
	for {
		select {
		case s := <-broker.newClients:
			broker.clients[s] = true
			log.Printf("Client added. %d registered clients", len(broker.clients))
		case s := <-broker.closingClients:
			delete(broker.clients, s)
			log.Printf("Removed client. %d registered clients", len(broker.clients))
		case event := <-broker.Notifier:
			for clientMessageChan := range broker.clients {
				select {
				case clientMessageChan <- event:
				case <-time.After(patience):
					log.Print("Skipping slow client")
				}
			}
		}
	}
}
