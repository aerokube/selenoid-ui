import React, { Component } from "react";
import { Terminal } from "xterm";
import urlTo from "../../util/urlTo";
import isSecure from "../../util/isSecure";

import "xterm/dist/xterm.css";
import { StyledLog } from "./style.css";
import colors from "ansi-256-colors";
import { BehaviorSubject, defer, fromEvent, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap } from "rxjs/operators";
import * as fit from "xterm/lib/addons/fit/fit";

export default class Log extends Component {
    constructor(props) {
        super(props);

        Terminal.applyAddon(fit);
        this.term = new Terminal({
            cursorBlink: false,
            tabStopWidth: 4,
            disableStdin: true,
            enableBold: false,
            fontSize: 13,
            lineHeight: 1,
            theme: {
                background: "#151515",
            },
        });
        this.props$ = new BehaviorSubject(props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.props$.next(nextProps);
    }

    componentDidMount() {
        this.term.open(this.termel);
        this.term.writeln(colors.fg.getRgb(2, 3, 4) + "Initialize...\n\r" + colors.reset);

        this.resize = fromEvent(window, "resize")
            .pipe(
                debounceTime(100),
                startWith({}),
                tap(() => this.term.fit())
            )
            .subscribe();

        this.subscription = this.props$
            .pipe(
                filter(it => it && it.session && it.origin && it.browser),
                distinctUntilChanged((prev, { origin }) => prev.origin === origin),
                map(({ session }) => {
                    const wsProxyUrl = urlTo(window.location.href);
                    return `${isSecure(wsProxyUrl) ? "wss" : "ws"}://${wsProxyUrl.host}/ws/logs/${session}`;
                }),
                switchMap(ws => {
                    return defer(() => {
                        this.term.clear();

                        return new Observable(observer => {
                            observer.next(`Connecting to ${ws}...\n\r`);

                            const socket = new WebSocket(ws);
                            const decoder = new TextDecoder("utf8");

                            socket.binaryType = "arraybuffer";
                            socket.onmessage = event => {
                                if (event) {
                                    observer.next(decoder.decode(event.data) + "\r");
                                }
                            };

                            socket.onopen = () => {
                                observer.next(colors.fg.getRgb(0, 2, 0) + "Connected!\n\r" + colors.reset);
                            };

                            socket.onclose = () => {
                                observer.next(colors.fg.getRgb(5, 1, 1) + "Disconnected\n\r" + colors.reset);
                            };

                            return () => {
                                socket && socket.readyState !== WebSocket.CLOSED && socket.close();
                            };
                        });
                    });
                })
            )
            .subscribe(msg => this.term.write(msg));
    }

    componentWillUnmount() {
        this.resize && this.resize.unsubscribe();
        this.subscription && this.subscription.unsubscribe();
        this.term.dispose();
    }

    render() {
        const { hidden, className } = this.props;

        return (
            <StyledLog className={`${className} hidden-${hidden}`}>
                <div className="log-card">
                    <div className="log-card__content">
                        <div
                            className="term"
                            ref={term => {
                                this.termel = term;
                            }}
                        />
                    </div>
                </div>
            </StyledLog>
        );
    }
}
