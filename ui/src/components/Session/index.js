import React, { Component } from "react";
import { withRouter } from 'react-router-dom'

import SessionInfo from "./SessionInfo";
import VncCard from "../VncCard";
import Log from "../Log";
import {StyledSession} from "./style.css";
import { mapActionCreators, rxConnect } from "rx-connect";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

class Session extends Component {
    componentDidUpdate({browser}) {
        const {history} = this.props;
        if (browser && !this.props.browser) { // if browser disappears
            history.push('/')
        }
    }

    render() {
        const {origin, session, browser, onVNCFullscreenChange, isLogHidden} = this.props;

        return (
            <StyledSession>
                <SessionInfo {...{
                    session,
                    browser
                }}/>

                {browser && (<div className="interactive">
                    <VncContainer {... {
                        origin,
                        session,
                        browser,
                        onVNCFullscreenChange
                    }}/>
                    <div className="session-interactive-card">
                        <Log {... {
                            origin,
                            session,
                            browser
                        }} hidden={isLogHidden}/>
                    </div>
                </div>)}
            </StyledSession>
        );
    }
}

export default withRouter(
  rxConnect(props$ => {
    const actions = {
      onVNCFullscreenChange$: new Subject()
    };

    return Observable.merge(
      props$,
      mapActionCreators(actions),
      actions.onVNCFullscreenChange$.map(isLogHidden => ({isLogHidden}))
    );
  })(Session)
);

function VncContainer({origin, session, browser = {}, onVNCFullscreenChange}) {
    if (browser.caps && !browser.caps.enableVNC) {
        return <span/>
    }

    return <div className="session-interactive-card">
        <VncCard {... {
            origin,
            session,
            browser,
            onVNCFullscreenChange
        }}/>
    </div>;
}

