import React from "react";

import "./style.scss";

const SessionInfo = (props) => {
    const {session = "", browser = { caps: {}}} = props;

    return (
        <div className="session-info">

            <div className="session-info__main">
                <div className="session-browser">
                    <span className="session-browser__quota">{browser.quota}</span>
                    {browser.quota && (<span className="session-browser__version-separator">/</span>)}
                    <span className="session-browser__name">{browser.caps.browserName}</span>
                    {browser.caps.browserName && (<span className="session-browser__version-separator">/</span>)}
                    <span className="session-browser__version">{browser.caps.version}</span>
                    {browser.caps.version && (<span className="session-browser__version-separator">/</span>)}
                    <span className="session-browser__resolution">{browser.caps.screenResolution}</span>
                </div>


                <div className="session-info__id">{session.substring(0, 8)}</div>
            </div>

            <div className="session-info__additional">
                <div className="custom-capabilities">
                    {browser.caps.name && (<div className="custom-capabilities__name">{browser.caps.name}</div>)}
                </div>
            </div>
        </div>
    );
};

export default SessionInfo;
