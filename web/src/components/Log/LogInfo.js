import React from "react";

const LogInfo = ({session, browser}) => {
    return (
        <div className="log-info">

            {browser.quota && (
                <div>
                    <span className="log-info__quota">{browser.quota}</span>
                    <span className="log-info__version-separator">:</span>
                </div>
            )}

            {browser.browser && (
                <span>
                    <span className="log-info__name">{browser.browser}</span>
                    <span className="log-info__version-separator">:</span>
                    <span className="log-info__version">{browser.version}</span>
                    <span className="log-info__version-separator">:</span>
                </span>
            )}

            <span>
                <span className="log-info__session">{session.substring(0, 8)}</span>
            </span>

        </div>
    );
};


export default LogInfo
