import React, { useState } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { merge, Observable, of, timer } from "rxjs";
import { catchError, delayWhen, flatMap, map, pluck, retryWhen, tap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

import { useObservable } from "rxjs-hooks";

import styled from "styled-components/macro";
import { GlobalStyle, StyledTopBar, StyledViewport } from "./styles.css";

import "event-source-polyfill";

import Navigation from "../../components/Navigation";
import Stats from "../../containers/Stats";
import Capabilities from "../../containers/Capabilities";
import Status from "../../components/Stats/Status";
import Sessions from "../../components/Sessions";
import Session from "../../components/Session";
import Videos from "../../components/Videos";
import Quota from "../../components/Stats/Quota";
import Queue from "../../components/Stats/Queue";
import Used from "../../components/Stats/Used";
import Separator from "../../components/Stats/Separator";

const links = videos => {
    return [
        { href: "/", title: "STATS", exact: true },
        { href: "/capabilities/", title: "CAPABILITIES", exact: true },
        ...(videos ? [{ href: "/videos", title: "VIDEOS", exact: true }] : []),
    ];
};

const Viewport = () => {
    const [{ status, sse }, onStatus] = useState({
        status: "unknown",
        sse: "unknown",
    });

    // can be checked offline with simple
    // const {origin, sse, status, state, browsers = {}, sessions = {}} = require("../../sse-example.json");

    const { origin, state = {}, browsers = {}, sessions = {} } = useObservable(
        in$ => {
            return in$.pipe(
                flatMap(([pushStatus]) =>
                    merge(
                        ajax("/status").pipe(
                            pluck("response"),
                            tap(() => pushStatus({ status: "ok" })),
                            catchError(e => {
                                pushStatus({ status: "error" });
                                return of();
                            })
                        ),

                        new Observable(observer => {
                            const sse = new EventSource("/events");

                            sse.onmessage = x => observer.next(x.data);
                            sse.onerror = x => observer.error(x);
                            sse.onopen = () => pushStatus({ sse: "ok" });

                            return () => {
                                sse.close();
                            };
                        }).pipe(
                            map(event => JSON.parse(event)),
                            map(event => {
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
                                        errors: [],
                                    };
                                }
                            }),
                            retryWhen(errs =>
                                errs.pipe(
                                    tap(err => {
                                        console.error("Error connecting to SSE", err.target ? err.target.url : err);
                                        pushStatus({
                                            sse: "error",
                                            status: "unknown",
                                        });
                                    }),
                                    delayWhen(() => timer(3000))
                                )
                            )
                        )
                    )
                )
            );
        },
        {
            state: {
                total: 0,
                used: 0,
                queued: 0,
                pending: 0,
                videos: [],
                browsers: {},
            },
        },
        [onStatus]
    );

    return (
        <>
            <GlobalStyle />
            <Router>
                <StatsBar>
                    <Logo>&nbsp;</Logo>

                    <Status status={sse} title="sse" />
                    <Status status={status} title="selenoid" />

                    <Separator>&nbsp;</Separator>

                    <Used total={state.total} used={state.used} pending={state.pending} />
                    <Separator>&nbsp;</Separator>
                    <Queue queued={state.queued} />
                    <Separator>&nbsp;</Separator>
                    <Quota total={state.total} used={state.used} pending={state.pending} />
                </StatsBar>
                <StyledViewport>
                    <StyledTopBar>
                        <Navigation links={links(state.videos)} />
                    </StyledTopBar>

                    <Route
                        exact={true}
                        path="/"
                        render={() => (
                            <Stats
                                {...{
                                    state,
                                    browsers,
                                }}
                            />
                        )}
                    />

                    <Route exact={true} path="/" render={() => <Sessions sessions={sessions} />} />

                    <Route exact={true} path="/videos" render={() => <Videos videos={state.videos || []} />} />

                    <Route
                        exact={true}
                        path="/capabilities"
                        render={() => <Capabilities state={state} origin={origin} />}
                    />

                    <Route
                        path="/sessions/:session"
                        render={({ match }) => (
                            <Session
                                session={match.params.session}
                                origin={origin}
                                browser={sessions[match.params.session]}
                            />
                        )}
                    />
                </StyledViewport>
            </Router>
        </>
    );
};

export default Viewport;

const StatsBar = styled.div`
    height: 80px;
    background-color: #272727;
    box-shadow: inset 0 -5px 5px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
`;

const aerokubeColor = "#4195d3";
const aerokubeColorBright = "#00c6f4";

const Logo = styled.div`
    line-height: 30px;
    transition: color 0.5s ease-out 0s;
    color: ${aerokubeColorBright};
    flex: 1;
    margin-left: 55px;
    position: relative;
    font-weight: 400;
    font-size: 16px;
    min-width: 50px;

    &:before {
        content: "";
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 1px;
        left: -30px;
        top: 0;
        box-shadow: 0 0 10px 5px ${aerokubeColor};
        border: 5px solid #272727;
        background-color: ${aerokubeColorBright};
    }
`;
