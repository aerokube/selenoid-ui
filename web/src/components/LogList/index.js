import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./style.scss";


export default class LogList extends Component {
    render() {
        const {sessions = {}} = this.props;
        const list = Object.keys(sessions);

        return (
            <div className="log-list">
                {list.length && list.map(session => {
                    return (
                        <Link className="log-session-link" key={session} to={`/log/${session}`}>
                            <div className="log-session-link__browser">
                                <span>{sessions[session].browser}</span>
                            </div>
                            <div className="log-session-link__version">{sessions[session].version}</div>
                        </Link>
                    );
                }) || (
                    <div className="log-list__no-any">
                        <div title="No any" className="icon dripicons-hourglass"/>
                        <div className="nolog-any-text">No sessions on this selenoid :'(</div>
                    </div>
                )}
            </div>
        );
    }
}
