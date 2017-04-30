package selenoid

import (
	"net/http"
	"context"
	"time"
	"encoding/json"
)

/* -------------- *
 * SELENOID TYPES *
 * ------v------- */

// Session - session id and vnc flag
type Session struct {
	ID     string `json:"id"`
	VNC    bool   `json:"vnc"`
	Screen string `json:"screen"`
}

// Sessions - used count and individual sessions for quota user
type Sessions struct {
	Count    int       `json:"count"`
	Sessions []Session `json:"sessions"`
}

// Quota - list of sessions for quota user
type Quota map[string]*Sessions

// Version - browser version for quota
type Version map[string]Quota

// Browsers - browser names for versions
type Browsers map[string]Version

// State - current state
type State struct {
	Total    int      `json:"total"`
	Used     int      `json:"used"`
	Queued   int      `json:"queued"`
	Pending  int      `json:"pending"`
	Browsers Browsers `json:"browsers"`
}

/* ------^------- *
 * SELENOID TYPES *
 * -------------- */

// sessionInfo - extended (and inverted) session information
type sessionInfo struct {
	ID      string `json:"id"`
	VNC     bool   `json:"vnc"`
	Screen  string `json:"screen"`
	Browser string `json:"browser"`
	Version string `json:"version"`
	Quota   string `json:"quota"`
}

// result - processed selenoid state
type result struct {
	State    State                     `json:"state"`
	Origin   string                    `json:"origin"`
	Browsers map[string]int            `json:"browsers"`
	Sessions map[string]sessionInfo    `json:"sessions"`
	Errors []interface{}    	   `json:"errors"`
}

func httpDo(ctx context.Context, req *http.Request, handle func(*http.Response, error) error) error {
	// Run the HTTP request in a goroutine and pass the response to handle function
	errChan := make(chan error, 1)
	go func() {
		errChan <- handle(http.DefaultClient.Do(req))
	}()
	select {
	case <-ctx.Done():
		{
			<-errChan // Wait for handle to return.
			return ctx.Err()
		}
	case err := <-errChan:
		{
			return err
		}
	}
}

func Status(ctx context.Context, baseUrl string) ([]byte, error) {
	req, err := http.NewRequest("GET", baseUrl+"/status", nil)
	if err != nil {
		return nil, err
	}

	timedCtx, cancel := context.WithTimeout(ctx, 1*time.Second)
	defer cancel()

	var state State
	if err = httpDo(ctx, req.WithContext(timedCtx), func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		return json.NewDecoder(resp.Body).Decode(&state)
	}); err != nil {
		return nil, err
	}

	browsers := make(map[string]int)
	sessions := make(map[string]sessionInfo)

	for browser, version := range state.Browsers {
		count := 0
		for versionName, quota := range version {
			for quotaName, sess := range quota {
				count += sess.Count
				for _, session := range sess.Sessions {
					sessions[session.ID] = sessionInfo{
						ID:      session.ID,
						VNC:     session.VNC,
						Screen:  session.Screen,
						Browser: browser,
						Version: versionName,
						Quota:   quotaName,
					}
				}
			}
		}
		browsers[browser] = count
	}

	return json.Marshal(result{
		State:    state,
		Origin:   baseUrl,
		Browsers: browsers,
		Sessions: sessions,
		Errors: make([]interface{}, 0),
	})
}
