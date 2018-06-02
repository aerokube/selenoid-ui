import React, {Component} from "react";
import {withRouter} from 'react-router-dom'

import SessionInfo from "./SessionInfo";
import VncCard from "../VncCard";
import Log from "../Log";
import "./style.scss";


class Session extends Component {
    componentDidUpdate({browser}) {
        const {history} = this.props;
        if (browser && !this.props.browser) {
            history.push('/')
        }
    }

    render() {
        const {origin, session, browser} = this.props;

        return (
            <div className="session">
                <SessionInfo {...{
                    session,
                    browser
                }}/>

                {browser && (<div className="session__interactive">
                    <VncContainer {... {
                        origin,
                        session,
                        browser
                    }}/>
                    <div className="session-interactive-card">
                        <Log {... {
                            origin,
                            session,
                            browser
                        }} />
                    </div>
                </div>)}
            </div>
        );
    }
}

export default withRouter(Session);

function VncContainer({origin, session, browser = {}}) {
    if (browser.caps && !browser.caps.enableVNC) {
        return <span/>
    }

    return <div className="session-interactive-card">
        <VncCard {... {
            origin,
            session,
            browser
        }}/>
    </div>;
}

