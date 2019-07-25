import React, { useState } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { merge, Observable, timer } from 'rxjs';
import { delayWhen, flatMap, map, pluck, retryWhen, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import { useObservable } from "rxjs-hooks";

import { GlobalStyle, StyledConnectionStatus, StyledTopBar, StyledViewport } from "./styles.css"

import 'event-source-polyfill'

import Navigation from "../../components/Navigation";
import Stats from "../../containers/Stats";
import Capabilities from "../../containers/Capabilities";
import Status from "../../components/Status";
import Sessions from "../../components/Sessions";
import Session from "../../components/Session";
import Videos from "../../components/Videos";

const links = (videos) => {
    return [
        { href: "/", title: "STATS", exact: true },
        { href: "/capabilities/", title: "CAPABILITIES", exact: true },
        ...(videos ? [{ href: "/videos", title: "VIDEOS", exact: true }] : [])
    ];
};

const Viewport = () => {
    const [{ status, sse }, onStatus] = useState({ status: "unknown", sse: "unknown" });


    // can be checked offline with simple
    // const {origin, sse, status, state, browsers = {}, sessions = {}} = require("../../sse-example.json");

    const { origin, state = {}, browsers = {}, sessions = {} } = useObservable(
        (in$) => {
            return in$.pipe(
                flatMap(([pushStatus]) => merge(
                    ajax('/status').pipe(
                        pluck('response'),
                        tap(() => pushStatus({ status: "ok" }))
                    ),

                    new Observable(observer => {
                        const sse = new EventSource('http://localhost:8080/events'); //fixme

                        sse.onmessage = x => observer.next(x.data);
                        sse.onerror = x => observer.error(x);
                        sse.onopen = () => pushStatus({ sse: "ok" });

                        return () => {
                            sse.close();
                        };
                    })
                        .pipe(
                            map(event => JSON.parse(event)),
                            map(event => {

                                console.log(event);

                                if (!event) {
                                    pushStatus({ status: "error" });
                                    return {};
                                }

                                if (event.errors && event.errors.length) {
                                    pushStatus({ status: "error" });
                                    return event;
                                }

                                if (event.state) {
                                    pushStatus({ status: "ok", sse: "ok" });
                                    return event;
                                } else {
                                    console.error("Wrong data from backend", event);
                                    pushStatus({ status: "error" });
                                    return {
                                        ...event,
                                        errors: []
                                    };
                                }
                            }),
                            retryWhen(errs => errs.pipe(
                                tap(err => {
                                    console.error('Error connecting to SSE', err.target ? err.target.url : err);
                                    pushStatus({
                                        sse: "error",
                                        status: "unknown"
                                    });
                                }),
                                delayWhen(() => timer(3000))
                            ))
                        )
                ))
            );
        },
        {
            state: {
                "total": 0,
                "used": 0,
                "queued": 0,
                "pending": 0,
                "videos": [],
                "browsers": {}
            }
        }, [onStatus]);

    return (
        <>
            <GlobalStyle/>
            <Router>
                <StyledViewport>
                    <StyledTopBar>
                        <StyledConnectionStatus>
                            <Status status={sse} title="sse"/>
                            <Status status={status} title="selenoid"/>
                        </StyledConnectionStatus>
                        <Navigation links={links(state.videos)}/>
                    </StyledTopBar>

                    <Route exact={true} path="/" render={() => (
                        <Stats {...{
                            state,
                            browsers
                        }}/>
                    )}/>

                    <Route exact={true} path="/" render={() => (
                        <Sessions sessions={sessions}/>
                    )}/>

                    <Route exact={true} path="/videos" render={() => (
                        <Videos videos={state.videos || []}/>
                    )}/>

                    <Route exact={true} path="/capabilities" render={() => (
                        <Capabilities state={state} origin={origin}/>
                    )}/>

                    <Route path="/sessions/:session" render={({ match }) => (
                        <Session session={match.params.session}
                                 origin={origin}
                                 browser={sessions[match.params.session]}/>
                    )}/>
                </StyledViewport>
            </Router>
        </>
    );
};

export default Viewport;
