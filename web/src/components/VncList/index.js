import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./style.scss";


export default class VncList extends Component {
    render() {
        const {sessions = {}} = this.props;
        const vnc = Object.keys(sessions)
            .filter(session => sessions[session].vnc);

        return (
            <div className="vnc-list">
                {vnc.length && vnc.map(session => {
                    return (
                        <Link className="vnc-session-link" key={session} to={`/vnc/${session}`}>
                            <div className="vnc-session-link__browser">
                                <span>{sessions[session].browser}</span>
                                <span
                                    className="vnc-session-link__browser_secondary">{sessions[session].screen}</span>
                            </div>
                            <div className="vnc-session-link__version">{sessions[session].version}</div>
                        </Link>
                    );
                }) || (<div className="vnc-session-link_no-any">NO ANY YET :'(</div>)}
            </div>
        );
    }
}
