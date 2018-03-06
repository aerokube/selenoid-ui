import React, {Component} from "react";
import {Terminal} from "xterm";
import {Link} from "react-router-dom";
import urlTo from "../../util/urlTo";
import "xterm/dist/xterm.css";
import "./style.scss";
import colors from "ansi-256-colors";
import Rx from "rxjs";
import {Observable} from "rxjs/Observable";
import * as fit from 'xterm/lib/addons/fit/fit';

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
                background: '#151515'
            }
        });
        this.props$ = new Rx.BehaviorSubject(props);
    }

    componentWillReceiveProps(nextProps) {
        this.props$.next(nextProps);
    }


    componentDidMount() {
        this.term.open(this.termel);

        this.resize = Rx.Observable.fromEvent(window, 'resize')
            .debounceTime(100)
            .startWith({})
            .do(() => this.term.fit())
            .subscribe();
        this.term.writeln(colors.fg.getRgb(2, 3, 4) + "Initialize...\n\r" + colors.reset);

        this.subscription = this.props$
            .map(({session, origin}) => ({session, origin}))
            .distinctUntilChanged()
            .filter(it => it && it.session && it.origin)
            .map(({session}) => {
                const wsProxyUrl = urlTo(window.location.href);
                return `ws://${wsProxyUrl.host}/ws/logs/${session}`;
            })
            .switchMap(ws => {
                return Rx.Observable.defer(() => {
                    this.term.clear();

                    return Observable.create(observer => {
                        observer.next(`Connecting to ${ws}...\n\r`);

                        const socket = new WebSocket(ws);
                        const decoder = new TextDecoder('utf8');

                        socket.binaryType = 'arraybuffer';
                        socket.onmessage = event => {
                            if (event) {
                                observer.next(decoder.decode(event.data) + '\r');
                            }
                        };

                        socket.onopen = () => {
                            observer.next(colors.fg.getRgb(0, 2, 0) + "Connected!\n\r" + colors.reset);
                        };

                        socket.onclose = () => {
                            observer.next(colors.fg.getRgb(5, 1, 1) + "Disconnected\n\r" + colors.reset);
                        };

                        return () => {
                            socket
                            && socket.readyState !== WebSocket.CLOSED
                            && socket.close();
                        };
                    })
                })
            })
            .do(msg => this.term.write(msg))
            .subscribe();
    }

    componentWillUnmount() {
        this.resize && this.resize.unsubscribe();
        this.subscription && this.subscription.unsubscribe();
    }

    render() {
        return (
            <div className="log">
                <div className="log-card">
                    <div className="log-card__header">
                        <Back/>
                    </div>

                    <div className="log-card__content">
                        <div className="term" ref={term => {
                            this.termel = term;
                        }}/>
                    </div>
                </div>
            </div>
        );
    }
}

const Back = () => (
    <Link className="control" to="/">
        <div title="Back"/>
    </Link>
);

