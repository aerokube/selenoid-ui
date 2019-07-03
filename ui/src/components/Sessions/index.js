import React, { useState } from "react";
import {Link} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete'
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import { Observable } from "rxjs";
import "./style.scss";
import CircularProgress from '@material-ui/core/CircularProgress';

const Sessions = (props) => {
    const {sessions = {}} = props;
    const list = Object.keys(sessions);

    const [loading, setLoading] = useState([])

    const deleteSession = (e, id) => {
      e.preventDefault()
      e.stopPropagation()
      setLoading([...loading, id])

      const deleteSession = Observable.ajax({
        url: `/wd/hub/session/${id}`,
        method: 'DELETE',
      })

      deleteSession.subscribe(
        res => {
          console.log(res)
        },
        err => {
          console.error(err)
          const index = loading.indexOf(id);
          if (index !== -1) {
            loading.splice(index, 1);
          }
          setLoading(loading)
        }
      );
    }

    return (
        <div className="sessions">
            <div className="sessions__section-title">
                Sessions
            </div>
            <TransitionGroup className={`sessions__list sessions__list_count-${list.length}`}>
                {list.length && list.map(session => {
                        return (
                            <CSSTransition
                                key={session}
                                timeout={500}
                                classNames="session-container_state"
                                unmountOnExit
                            >
                                <div className="session-container">
                                    <Link className="session-link" to={`/sessions/${session}`}>
                                        <div className="session-link-browser">
                                            <span className="session-link-browser__name">
                                                {sessions[session].caps.browserName}
                                            </span>
                                            <span className="session-link-browser__version">
                                                {sessions[session].caps.version}
                                            </span>
                                        </div>
                                        {sessions[session].caps.name && (
                                            <div className="session-cap session-cap__name"
                                                 title={sessions[session].caps.name}>
                                                {sessions[session].caps.name}
                                            </div>
                                        )}
                                        <button className="session__delete" onClick={(e) => deleteSession(e, session)}>
                                          { loading.indexOf(session) > -1 ?
                                            <CircularProgress size={18} color="secondary" />
                                            :
                                            <DeleteIcon htmlColor="#fff" fontSize="small" />
                                          }
                                        </button>

                                        {sessions[session].caps.enableVNC && (
                                            <div className="session-cap session-cap__with-vnc">
                                                <span title="With VNC" className="icon dripicons-device-desktop"/>&nbsp;
                                                <sup>VNC</sup>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            </CSSTransition>
                        );
                    }
                )}
            </TransitionGroup>
            {(
                <CSSTransition
                    in={!list.length}
                    timeout={500}
                    exit={false}
                    classNames="sessions__no-any_state"
                    unmountOnExit
                >
                    <div className="sessions__no-any">
                        <div title="No any" className="icon dripicons-hourglass"/>
                        <div className="nosession-any-text">NO SESSIONS YET :'(</div>
                    </div>
                </CSSTransition>
            )}

        </div>
    );
};

export default Sessions;
