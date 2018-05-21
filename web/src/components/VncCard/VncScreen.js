import React, {Component} from "react";
import RFB from "@novnc/novnc/core/rfb";
import urlTo from "../../util/urlTo"

import "./style.scss";

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
        //FIXME ignore on unmount
        this.props.onUpdateState(connection);
    }

    componentDidMount() {
        const {session, origin} = this.props;
        this.connection('connecting');


        if (origin && session) {
            const link = urlTo(window.location.href);
            const port = VncScreen.defaultPort(link);

            this.disconnect(this.rfb);
            this.rfb = this.createRFB(link, port, session);
        }
    }

    componentDidUpdate(prevProps) {
        const prevOrigin = prevProps.origin;
        const {session, origin} = this.props;

        if (origin && session && prevOrigin !== origin) {
            const link = urlTo(window.location.href);
            const port = VncScreen.defaultPort(link);

            this.disconnect(this.rfb);
            this.rfb = this.createRFB(link, port, session);
        }
    }

    componentWillUnmount() {
        this.disconnect(this.rfb);
    }

    createRFB(link, port, session) {
        const rfb = new RFB(
            this.canvas,
            `ws://${link.hostname}:${port}/ws/vnc/${session}`,
            {
                credentials: {
                    password: "selenoid"
                }
            }
        );

        rfb.addEventListener("connect", () => {
            this.connection("connected");
        });

        rfb.addEventListener("disconnect", () => {
            this.connection("disconnected");
        });

        rfb.scaleViewport = true;
        rfb.resizeSession = true;
        // rfb.viewOnly = true;
        return rfb;
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
                <button onClick={() => {this.rfb.viewOnly = !this.rfb.viewOnly}}>TOGGLE View Only</button>
            </div>
        );
    }
}
