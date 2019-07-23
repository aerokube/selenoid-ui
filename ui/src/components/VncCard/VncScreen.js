import React, {Component} from "react";
import RFB from "@novnc/novnc/core/rfb";
import urlTo from "../../util/urlTo"
import isSecure from "../../util/isSecure"

export default class VncScreen extends Component {

    static resizeVnc(rfb) {
        if (rfb) {
            rfb.resizeSession = true;
            rfb.scaleViewport = true;
        }
    }

    static defaultPort({port, protocol}) {
        return port || (protocol === "https:" ? "443" : "80");
    }

    connection(connection) {
        this.props.onUpdateState(connection);
    }

    onVNCDisconnect = () => {
        this.connection("disconnected");
    };

    onVNCConnect = () => {
        this.connection("connected");
    };

    componentDidMount() {
        const {session, origin} = this.props;
        this.connection('connecting');


        if (origin && session) {
            const link = urlTo(window.location.href);
            const port = VncScreen.defaultPort(link);

            this.disconnect(this.rfb);
            this.rfb = this.createRFB(link, port, session, isSecure(link));
        }
    }

    componentDidUpdate(prevProps) {
        const prevOrigin = prevProps.origin;
        const {session, origin} = this.props;

        if (origin && session && prevOrigin !== origin) {
            const link = urlTo(window.location.href);
            const port = VncScreen.defaultPort(link);

            this.disconnect(this.rfb);
            this.rfb = this.createRFB(link, port, session, isSecure(link));
        }
    }

    componentWillUnmount() {
        this.rfb && this.rfb.removeEventListener("disconnect", this.onVNCDisconnect);
        this.rfb && this.rfb.removeEventListener("connect", this.onVNCConnect);
        this.disconnect(this.rfb);
    }

    createRFB(link, port, session, secure) {
        const rfb = new RFB(
            this.canvas,
            `${secure ? 'wss' : 'ws'}://${link.hostname}:${port}/ws/vnc/${session}`,
            {
                credentials: {
                    password: "selenoid"
                }
            }
        );

        rfb.addEventListener("connect", this.onVNCConnect);
        rfb.addEventListener("disconnect", this.onVNCDisconnect);

        rfb.scaleViewport = true;
        rfb.resizeSession = true;
        rfb.viewOnly = true;
        return rfb;
    }

    lock(unlocked) {
        if (this.rfb) {
            this.rfb.viewOnly = !unlocked;
        }
    }

    disconnect(rfb) {
        if (rfb && rfb._rfb_connection_state && rfb._rfb_connection_state !== 'disconnected') {
            rfb.disconnect();
        }
    }

    render() {
        return (
            <div className="vnc-screen" ref={screen => {
                this.canvas = screen;
                VncScreen.resizeVnc(this.rfb);
            }}>
            </div>
        );
    }
}
