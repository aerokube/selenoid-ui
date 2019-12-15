package main

import (
	"flag"
	"log"
	"net/http"
	"os"
)

var uri string

func init() {
	flag.StringVar(&uri, "uri", "http://localhost:8080/ping", "uri to check the UI")
	flag.Parse()
}

func main() {
	if !healthy(uri) {
		log.Println("NOT OK")
		os.Exit(1)
	}
	log.Println("OK")
}

func healthy(uiUri string) bool {
	if resp, err := http.Get(uiUri); err == nil {
		defer resp.Body.Close()
		return true
	}
	return false
}
