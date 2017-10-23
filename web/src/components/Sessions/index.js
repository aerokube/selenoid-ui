import React from "react";
import {Link} from "react-router-dom";

import "./style.scss";


const Sessions = (props) => {
    const {sessions = {}} = props;
    const list = Object.keys(sessions);

    return (
        <div className={`sessions sessions_count-${list.length}`}>
            {list.length && list.map(session => {
                return (
                    <div className="session-container">
                        <Link className="session-link" key={session}
                              to={`/sessions/${session}`}>
                            <div className="session-link-browser">
                                <span className="session-link-browser__name">{sessions[session].caps.browserName}</span>
                                <span className="session-link-browser__version">{sessions[session].caps.version}</span>
                            </div>
                            {sessions[session].caps.name && (
                                <div className="session-cap session-cap__name" title={sessions[session].caps.name}>
                                    {sessions[session].caps.name}
                                </div>
                            )}
                            {sessions[session].caps.enableVNC && (
                                <div className="session-cap session-cap__with-vnc">
                                    <span title="With VNC" className="icon dripicons-device-desktop"/>&nbsp;
                                    <sup>VNC</sup>
                                </div>
                            )}
                        </Link>
                    </div>
                );
            }) || (
                <div className="sessions__no-any">
                    <div title="No any" className="icon dripicons-hourglass"/>
                    <div className="nosession-any-text">NO SESSIONS YET :'(</div>
                </div>
            )}
        </div>
    );
};

export default Sessions;
