import React, {Component} from "react";
import RFB from "noVNC/core/rfb";
import link from "../../util/link"

import "./style.scss";

export default class VncScreen extends Component {

    static resizeVnc({width = 1, height = 1}, rfb) {
        if (rfb && rfb.get_display()) {
            let display = rfb.get_display();
            display.set_scale(1);
            display.autoscale(width, height, false);
        }
    }

    connection(connection) {
        this.props.onUpdateState(connection);
    }

    componentDidMount() {
        const {session, origin} = this.props;
        this.connection('connecting');

        try {
            this.rfb = new RFB({
                encrypt: false,
                target: this.canvas,
                onFBUComplete: (rfb) => {
                    // set right size of canvas, based on enclosing element
                    VncScreen.resizeVnc(this.screen || {}, rfb);

                    rfb.set_onFBUComplete(() => {
                    })
                },
                onUpdateState: (rfb, state) => {
                    this.connection(state);
                },
                onDisconnected: (rfb, reason) => {
                }
            });
        } catch (exc) {
            console.error("Unable to create RFB client", exc);
            return;
        }

        if (origin && session) {
            let link = link(origin);
            this.rfb.connect(link.hostname, link.port, "selenoid", `vnc/${session}`);
        }
    }

    componentDidUpdate(prevProps) {
        const prevOrigin = prevProps.origin;
        const {session, origin} = this.props;

        if (origin && session && prevOrigin !== origin) {
            let link = link(origin);

            this.rfb.connect(link.hostname, link.port, "selenoid", `vnc/${session}`);
        }
    }

    componentWillUnmount() {
        if (this.rfb && this.rfb._rfb_connection_state && this.rfb._rfb_connection_state !== 'disconnected') {
            this.rfb.set_onUpdateState(() => {
            });
            this.rfb.set_onDisconnected(() => {
            });
            this.rfb.disconnect();
        }
    }

    render() {
        return (
            <div className="vnc-screen" ref={ screen => {
                const {offsetHeight = 1, offsetWidth = 1} = (screen || {});
                this.screen = {width: offsetWidth, height: offsetHeight};
                VncScreen.resizeVnc(this.screen, this.rfb);
            }}>
                <canvas ref={
                    canvas => {
                        this.canvas = canvas;
                    }
                } width="0" height="0">
                    Canvas not supported.
                </canvas>
            </div>
        );
    }
}
