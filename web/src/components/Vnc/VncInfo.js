import React, {Component} from "react";

import "./style.scss";


export default class VncInfo extends Component {
    render() {
        const {session = "", browser = {}} = this.props;

        return (
            <div className="vnc-info">
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
        );
    }
}
