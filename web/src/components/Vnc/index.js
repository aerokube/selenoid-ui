import React, {Component} from "react";
import RFB from "noVNC/core/rfb";
import {Link} from "react-router-dom";

import "./style.scss";


export default class Vnc extends Component {

    componentDidMount() {
        const {session, origin} = this.props;

        let link = document.createElement('a');
        link.setAttribute('href', origin);

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
        this.rfb.connect(link.hostname, link.port, "selenoid", `vnc/${session}`);
    }

    componentWillUnmount() {
        this.rfb.disconnect();
    }

    render() {
        const {session = "", browser = {}} = this.props;

        return (
            <div className="vnc">
                <div className="vnc-card">
                    <div className="vnc-card__controls">
                        <Link className="control" to="/vnc/">Back</Link>
                    </div>

                    <div className="vnc-card__content">
                        <div className="header">
                            <div className="vnc-browser">
                                <span className="vnc-browser__quota">{browser.quota}</span>
                                {browser.quota && (<span className="vnc-browser__version-separator">/</span>)}
                                <span className="vnc-browser__name">{browser.browser}</span>
                                {browser.browser && (<span className="vnc-browser__version-separator">/</span>)}
                                <span className="vnc-browser__version">{browser.version}</span>
                            </div>

                            <div className="vnc-resolution">{browser.screen}</div>

                            <div className="vnc-session">
                                <span className="vnc-session__id">{session.substring(0, 8)}</span>
                            </div>
                        </div>
                        <div className="screen" ref={ screen => {
                            const {offsetHeight = 1, offsetWidth = 1} = (screen || {});
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
                </div>
            </div>
        );
    }
}
