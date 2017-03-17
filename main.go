package main

import (
	"net/http"
	"log"
)

//go:generate go-bindata-assetfs data/

func mux() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(assetFS()))
	return mux
}

func main() {
	listen := ":8080"
	log.Printf("Listening on %s\n", listen)
	log.Fatal(http.ListenAndServe(listen, mux()))
}
