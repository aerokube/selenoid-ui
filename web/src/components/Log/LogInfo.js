import React from "react";

const LogInfo = ({session}) => {
    return (
        <div className="log-info">
            <div>
                <span className="log-info__session">LOG</span>
                <span className="log-info__version-separator"> :: </span>
                <span className="log-info__session">{session.substring(0, 8)}</span>
            </div>
        </div>
    );
};

export default LogInfo
