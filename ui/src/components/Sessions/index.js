import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ajax } from "rxjs/ajax";
import { StyledSessions } from "./style.css";
import BeatLoader from "react-spinners/BeatLoader";

const Sessions = ({ sessions = {} }) => {
    const ids = Object.keys(sessions);

    return (
        <StyledSessions>
            <div className="section-title">Sessions</div>
            <TransitionGroup className={`sessions__list sessions__list_count-${ids.length}`}>
                {ids.length &&
                    ids.map(id => {
                        return (
                            <CSSTransition key={id} timeout={500} classNames="session-container_state" unmountOnExit>
                                <Session id={id} session={sessions[id]} />
                            </CSSTransition>
                        );
                    })}
            </TransitionGroup>
            <CSSTransition
                in={!ids.length}
                timeout={500}
                exit={false}
                classNames="sessions__no-any_state"
                unmountOnExit
            >
                <div className="no-any">
                    <div title="No any" className="icon dripicons-hourglass" />
                    <div className="nosession-any-text">NO SESSIONS YET :'(</div>
                </div>
            </CSSTransition>
        </StyledSessions>
    );
};

const Session = ({ id, session: { caps } }) => {
    const [deleting, onDeleting] = useState(false);

    const deleteSession = e => {
        e.preventDefault();
        e.stopPropagation();
        onDeleting(true);

        ajax({
            url: `/wd/hub/session/${id}`,
            method: "DELETE",
        }).subscribe(
            () => {},
            error => {
                console.error("Can't delete session", id, error);
                onDeleting(false);
            }
        );
    };

    return (
        <div className="session-container">
            <Link className="session-link" to={deleting ? `#` : `/sessions/${id}`}>
                <div className="browser">
                    <span className="name">{caps.browserName}</span>
                    <span className="version">{caps.version}</span>
                </div>
                {caps.name && (
                    <div className="capability capability__name" title={caps.name}>
                        {caps.name}
                    </div>
                )}
                <button disabled={deleting} className="capability capability__session-delete" onClick={deleteSession}>
                    {deleting ? (
                        <BeatLoader size={2} color={"#fff"} />
                    ) : (
                        <span title="Delete" className="icon dripicons-power" />
                    )}
                </button>

                {caps.enableVNC && (
                    <div className="capability capability__with-vnc">
                        <span title="With VNC" className="icon dripicons-device-desktop" />
                        &nbsp;
                        <sup>VNC</sup>
                    </div>
                )}
            </Link>
        </div>
    );
};

export default Sessions;
