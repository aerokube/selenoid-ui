import React, {Component} from "react";
import Terminal from "xterm";
import {Link} from "react-router-dom";
import urlTo from "../../util/urlTo";
import "xterm/dist/xterm.css";
import "./style.scss";
import colors from "ansi-256-colors";

export default class Log extends Component {
    componentDidMount() {
        const {session, origin} = this.props;

        Terminal.loadAddon('fit');

        this.terminal = new Terminal();
        this.terminal.open(this.termel, true);
        this.terminal.fit();
        this.terminal.writeln(colors.fg.getRgb(2,3,4) + "Initialize..." + colors.reset);

        if (origin && session) {
            this.connect(origin, session);
        }
    }

    componentDidUpdate(prevProps) {
        const prevOrigin = prevProps.origin;
        const {session, origin} = this.props;

        if (origin && session && prevOrigin !== origin) {
            this.connect(origin, session);
        }
    }

    connect(origin, session) {
        const selenoid = urlTo(origin);
        const ws = `ws://${selenoid.host}/logs/${session}`;

        this.terminal.writeln(`Connecting to ${ws}...`);

        this.socket = new WebSocket(ws);
        this.socket.binaryType = 'arraybuffer';
        this.socket.onmessage = event => {
            const arrayBufferToStr = ab => {
                let i = 8;
                let result = '';
                const view = new DataView(ab);

                while (i < ab.byteLength) {
                    const code = view.getUint8(i);
                    if (code === 10) {
                        result += "\n\r";
                        i += 9;
                        continue;
                    }

                    result += String.fromCharCode(code);
                    i++;
                }

                return result;
            };

            if (event) {
                const msg = arrayBufferToStr(event.data);
                this.terminal.write(msg);
            }
        };

        this.socket.onopen = () => {
            this.terminal.writeln(colors.fg.getRgb(0,2,0) + "Connected!" + colors.reset);
        };

        this.socket.onclose = () => {
            this.terminal.writeln(colors.fg.getRgb(5,1,1) + "Disconnected" + colors.reset);
        };
    }

    render() {
        const {session, browser = {}} = this.props;

        return (
            <div className="log">
                <div className="log-card">
                    <div className="log-card__header">
                        <Back/>
                        <LogInfo browser={browser} session={session}/>
                    </div>

                    <div className="log-card__content">
                        <div className="term" ref={ term => {
                            this.termel = term;
                        }}></div>
                    </div>

                </div>
            </div>
        );
    }
}

function Back() {
    return <Link className="control" to="/log/">
        <div title="Back"></div>
    </Link>;
}

function LogInfo(props) {
    const {session, browser} = props;

    return (<div className="log-info">
            <span className="log-info__quota">{browser.quota}</span>
            {browser.quota && (<span className="log-info__version-separator">:</span>)}
            <span className="log-info__name">{browser.browser}</span>
            {browser.browser && (<span className="log-info__version-separator">:</span>)}
            <span className="log-info__version">{browser.version}</span>
            {browser.browser && (<span className="log-info__version-separator">:</span>)}
            <span className="log-session">{session.substring(0, 8)}</span>
    </div>);
}
