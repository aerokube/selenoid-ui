import React, {Component} from "react";
import {HashRouter as Router, Route} from "react-router-dom";
import {validate} from "jsonschema";
import {rxConnect} from "rx-connect";
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import "./style.scss";

import Navigation from "components/Navigation";
import Stats from "containers/Stats";
import Capabilities from "containers/Capabilities";
import Log from "components/Log";
import Status from "components/Status";
import Sessions from "components/Sessions";
import Session from "components/Session";


const schema = {
    "id": "/selenoid",
    "type": "object",
    "properties": {
        "total": {
            "type": "number"
        },
        "used": {
            "type": "number"
        },
        "queued": {
            "type": "number"
        },
        "pending": {
            "type": "number"
        },
        "browsers": {
            "id": "/browser",
            "type": "object",
            "patternProperties": {
                ".*": {
                    "id": "/version",
                    "type": "object",
                    "patternProperties": {
                        ".*": {
                            "id": "/quota",
                            "type": "object",
                            "patternProperties": {
                                ".*": {
                                    "type": "object",
                                    "properties": {
                                        "count": {
                                            "type": "number"
                                        },
                                        "sessions": {
                                            "type": "array",
                                            "items": {
                                                "id": "/session",
                                                "type": "object",
                                                "properties": {
                                                    "id": {
                                                        "type": "string"
                                                    },
                                                    "container": {
                                                        "type": "string"
                                                    },
                                                    "caps": {
                                                        "type": "object",
                                                        "properties": {
                                                            "browserName": {
                                                                "type": "string"
                                                            },
                                                            "version": {
                                                                "type": "string"
                                                            },
                                                            "screenResolution": {
                                                                "type": "string"
                                                            },
                                                            "enableVNC": {
                                                                "type": "boolean"
                                                            },
                                                            "name": {
                                                                "type": "string"
                                                            },
                                                            "timeZone": {
                                                                "type": "string"
                                                            }
                                                        },
                                                        "required": [
                                                            "browserName",
                                                            "version"
                                                        ]
                                                    }
                                                },
                                                "required": [
                                                    "id"
                                                ]
                                            }
                                        }
                                    },
                                    "required": [
                                        "count"
                                    ]
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "required": [
        "total",
        "used",
        "pending",
        "queued",
        "browsers"
    ]
};

@rxConnect(() => {
    const open = new Subject();
    const errors = new Subject();

    return Observable.merge(
        Observable.defer(() => Observable.create(observer => {
            const sse = new EventSource('/events');
            sse.onmessage = x => observer.next(x.data);
            sse.onerror = x => observer.error(x);
            sse.onopen = x => open.next(x);

            return () => {
                sse.close();
            };
        }))
            .map(event => JSON.parse(event))
            .map(event => {
                if (event.errors && event.errors.length) {
                    return {
                        ...event,
                        status: "error",
                    };
                }

                const validation = validate(event.state, schema);
                if (validation.valid) {
                    return {
                        ...event,
                        status: "ok",
                    };
                } else {
                    console.error("Wrong data from backend", validation.errors);
                    return {
                        ...event,
                        status: "error",
                        errors: validation.errors
                    };
                }
            })
            .retryWhen(errs => errs
                .do(err => {
                    console.error('Error connecting to SSE', err.target.url);
                    errors.next({
                        sse: "error",
                        status: "unknown"
                    });
                })
                .delayWhen(val => Observable.timer(3000))
            ),
        Observable.merge(
            open.map(event => ({
                sse: "ok"
            })),
            errors
        )
    ).startWith({
        sse: "unknown",
        status: "unknown",
        state: {
            "total": 0,
            "used": 0,
            "queued": 0,
            "pending": 0,
            "browsers": {}
        }
    });
})
export default class Viewport extends Component {
    render() {
        const links = [
            {href: "/", title: "STATS", exact: true},
            {href: "/sessions/", title: "SESSIONS"}
        ];

        const {origin, sse, status, state, browsers = {}, sessions = {}} = this.props;

        return (
            <Router>
                <div className="viewport">
                    <div className="top-bar">
                        <div className="connection-status">
                            <Status status={sse} title="sse"/>
                            <Status status={status} title="selenoid"/>
                        </div>
                        <Navigation links={links}/>
                    </div>

                    <Route exact={true} path="/" render={() => (
                        <Stats {...{
                            state,
                            browsers
                        }}/>
                    )}/>

                    <Route exact={true} path="/" render={() => (
                        <Capabilities state={state} origin={origin}/>
                    )}/>

                    <Route exact={true} path="/sessions/" render={() => (
                        <Sessions sessions={sessions}/>
                    )}/>

                    <Route path="/sessions/:session" render={({match}) => (
                        <Session session={match.params.session}
                                 origin={origin}
                                 browser={sessions[match.params.session]}/>
                    )}/>
                </div>
            </Router>
        );
    }
}
