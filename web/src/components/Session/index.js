import React, {Component} from "react";
import SessionInfo from "./SessionInfo";
import VncCard from "../VncCard";
import Log from "../Log";
import "./style.scss";


export default class Session extends Component {
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

