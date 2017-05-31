package main

import (
	"testing"
	. "github.com/aandryashin/matchers"
	"fmt"
	"strings"
)

func TestLoads(t *testing.T) {

}

func TestRegex(t *testing.T) {
	paths := []string{
		"/manifest.bundle.js",
		"/hljs.bundle.js",
		"/vendor.bundle.js",
		"/js.bundle.js",
		"/log/2j",
		"/log/js.bundle.js",
		"/log/manifest.bundle.js",
		"/vnc/2",
	}

	for _, path := range paths {
		AssertThat(t, staticRewrite(path), NotContains{"log"})
		AssertThat(t, staticRewrite(path), NotContains{"vnc"})
	}
}

type NotContains struct {
	V interface{}
}

func (m NotContains) Match(i interface{}) bool {
	return !strings.Contains(i.(string), m.V.(string))
}

func (m NotContains) String() string {
	return fmt.Sprintf("not contains %v", m.V)
}
