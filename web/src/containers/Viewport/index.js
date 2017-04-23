import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import "./style.scss";

import Navigation from "components/Navigation";
import Stats from "containers/Stats";
import Vnc from "containers/Vnc";

export default class Viewport extends Component {
    render() {
        const links = [
            {href: "/", title: "STATS", exact: true},
            {href: "/vnc/", title: "VNC"}
        ];

        return (
            <Router>
                <div className="viewport">
                    <div className="navigation-top">
                        <Navigation links={links}/>
                    </div>

                    <Route exact={true} path="/" component={Stats}/>
                    <Route exact={true} path="/vnc/" component={Vnc}/>
                    <Route path="/vnc/:session" render={({match}) => (
                        <Vnc session={match.params.session}
                             browser={{name: "firefox", version: "55.0"}}/>
                    )}/>
                </div>
            </Router>
        );
    }
}
