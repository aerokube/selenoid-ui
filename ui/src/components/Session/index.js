import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";

import SessionInfo from "./SessionInfo";
import VncCard from "../VncCard";
import Log from "../Log";
import { StyledSession } from "./style.css";

/**
 * The ref object is a generic container whose current property is mutable
 * and can hold any value, similar to an instance property on a class
 */
function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
}

const Session = ({ origin, session, browser, history }) => {
    const prevBrowser = usePrevious(browser);

    useEffect(() => {
        if (prevBrowser && !browser) {
            // if browser disappears only
            history.push("/");
        }
    }, [browser, history, prevBrowser]);

    const [isLogHidden, onVNCFullscreenChange] = useState(false);

    return (
        <StyledSession>
            <SessionInfo
                {...{
                    session,
                    browser,
                }}
            />

            {browser && (
                <div className="interactive">
                    <VncContainer
                        {...{
                            origin,
                            session,
                            browser,
                            onVNCFullscreenChange,
                        }}
                    />
                    <div className="session-interactive-card">
                        <Log
                            {...{
                                origin,
                                session,
                                browser,
                            }}
                            hidden={isLogHidden}
                        />
                    </div>
                </div>
            )}
        </StyledSession>
    );
};

export default withRouter(Session);

function VncContainer({ origin, session, browser = {}, onVNCFullscreenChange }) {
    if (browser.caps && !browser.caps.enableVNC) {
        return <span />;
    }

    return (
        <div className="session-interactive-card">
            <VncCard
                {...{
                    origin,
                    session,
                    browser,
                    onVNCFullscreenChange,
                }}
            />
        </div>
    );
}
