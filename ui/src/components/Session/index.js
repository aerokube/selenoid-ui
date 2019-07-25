import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom'

import SessionInfo from "./SessionInfo";
import VncCard from "../VncCard";
import Log from "../Log";
import { StyledSession } from "./style.css";

const Session = ({ origin, session, browser, history }) => {
    useEffect(() => {
        if (browser) { // if browser disappears only
            history.push('/') //fixme prev state browser && !state.browser ?
        }
    }, [browser, history]);

    const [isLogHidden, onVNCFullscreenChange] = useState(false);

    return (
        <StyledSession>
            <SessionInfo {...{
                session,
                browser
            }}/>

            {browser && (<div className="interactive">
                <VncContainer {...{
                    origin,
                    session,
                    browser,
                    onVNCFullscreenChange
                }}/>
                <div className="session-interactive-card">
                    <Log {...{
                        origin,
                        session,
                        browser
                    }} hidden={isLogHidden}/>
                </div>
            </div>)}
        </StyledSession>
    );
};

export default withRouter(Session);

function VncContainer({ origin, session, browser = {}, onVNCFullscreenChange }) {
    if (browser.caps && !browser.caps.enableVNC) {
        return <span/>
    }

    return <div className="session-interactive-card">
        <VncCard {...{
            origin,
            session,
            browser,
            onVNCFullscreenChange
        }}/>
    </div>;
}

