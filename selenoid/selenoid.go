package selenoid

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"io/ioutil"
	"net/http"
)

/* -------------- *
 * SELENOID TYPES *
 * ------v------- */

// Caps - user capabilities
type Caps struct {
	Name             string `json:"browserName"`
	Version          string `json:"version"`
	ScreenResolution string `json:"screenResolution"`
	VNC              bool   `json:"enableVNC"`
	TestName         string `json:"name"`
	TimeZone         string `json:"timeZone"`
}

// Session - session id and vnc flag
type Session struct {
	ID        string `json:"id"`
	Container string `json:"container"`
	Caps      Caps   `json:"caps"`
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
	Videos Videos `json:"videos"`
}

// Videos -
type Videos struct{
	Name []string	`xml:"a" json:"name"`
}



/* ------^------- *
 * SELENOID TYPES *
 * -------------- */

// sessionInfo - extended session information
type sessionInfo struct {
	ID        string `json:"id"`
	Container string `json:"container"`
	Caps      Caps   `json:"caps"`
	Quota     string `json:"quota"`
}

// result - processed selenoid state
type result struct {
	State    State                  `json:"state"`
	Origin   string                 `json:"origin"`
	Browsers map[string]int         `json:"browsers"`
	Sessions map[string]sessionInfo `json:"sessions"`
	Errors   []interface{}          `json:"errors"`
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

const (
	statusPath = "/status"
	videosPath = "/video"
)

func Status(ctx context.Context, baseUrl string) ([]byte, error) {
	req, err := http.NewRequest("GET", baseUrl+statusPath, nil)
	if err != nil {
		return nil, err
	}

	var state State

	videos := &Videos{Name:nil}

	if err = httpDo(ctx, req.WithContext(ctx), func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		return json.NewDecoder(resp.Body).Decode(&state)
	}); err != nil {
		return nil, err
	}


	req, err = http.NewRequest("GET", baseUrl+videosPath, nil)
	if err != nil {
		return nil, err
	}

	//if no video enpoint just return empty
	_ = httpDo(ctx, req.WithContext(ctx), func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		return xml.NewDecoder(resp.Body).Decode(&videos)
	})

	state.Videos = *videos

	return json.Marshal(toUI(state, baseUrl))
}


func Video(orig *http.Request, baseUrl string, video string) ([]byte,*http.Response,error) {
	var respVideo []byte

	r:= &http.Response{}

	req, err := http.NewRequest("GET", baseUrl+videosPath+"/"+video, nil)
	if err != nil {
		return nil, r,err
	}

	req.Header = orig.Header

	if err = httpDo(orig.Context(), req.WithContext(orig.Context()), func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		respVideo,err = ioutil.ReadAll(resp.Body)
		r = resp

		if err != nil {
			return err
		}

		return nil

	}); err != nil {
		return nil,r ,err
	}


	return respVideo, r,err
}

func toUI(state State, baseUrl string) result {
	browsers := make(map[string]int)
	sessions := make(map[string]sessionInfo)

	for browser, version := range state.Browsers {
		count := 0
		for _, quota := range version {
			for quotaName, sess := range quota {
				count += sess.Count
				for _, session := range sess.Sessions {
					sessions[session.ID] = sessionInfo{
						ID:        session.ID,
						Quota:     quotaName,
						Container: session.Container,
						Caps:      session.Caps,
					}
				}
			}
		}
		browsers[browser] = count
	}

	return result{
		State:    state,
		Origin:   baseUrl,
		Browsers: browsers,
		Sessions: sessions,
		Errors:   make([]interface{}, 0),
	}
}
