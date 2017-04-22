import React, {Component} from "react";
import RFB from "noVNC/core/rfb";

import "./style.scss";


export default class Vnc extends Component {

    componentDidMount() {
        try {
            this.rfb = new RFB({
                encrypt: false,
                target: this.canvas,
                onFBUComplete: () => {
                    const {width, height} = this.screen;

                    if (screen && this.rfb.get_display()) {
                        let display = this.rfb.get_display();
                        display.set_scale(1);
                        display.autoscale(width, height, false);
                    }

                    this.rfb.set_onFBUComplete(() => {
                    })
                }
            });
        } catch (exc) {
            console.error("Unable to create RFB client", exc);
            return;
        }
        this.rfb.connect("localhost", "5900", "selenoid", "/");
    }

    componentWillUnmount() {
        this.rfb.disconnect();
    }

    render() {
        return (
            <div className="vnc">
                <div className="screen" ref={ screen => {
                    const {offsetHeight = 0, offsetWidth = 0} = (screen || {});
                    this.screen = {width: offsetWidth, height: offsetHeight};
                }}>
                    <canvas ref={
                        canvas => {
                            this.canvas = canvas;
                        }
                    } width="0" height="0">
                        Canvas not supported.
                    </canvas>
                </div>
            </div>
        );
    }
}
