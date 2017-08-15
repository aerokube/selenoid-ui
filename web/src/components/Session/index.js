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

                <Log { ... {
                    origin,
                    session,
                    browser
                }} />

                <VncCard { ... {
                    origin,
                    session,
                    browser
                }}/>

            </div>
        );
    }
}

