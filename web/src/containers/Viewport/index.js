import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import "./style.scss";

import Navigation from "components/Navigation";
import Stats from "containers/Stats";
import Vnc from "containers/Vnc";

export default class Viewport extends Component {
    render() {
        const links = [
            {href: "/", title: "STATS"},
            {href: "/vnc/", title: "VNC"}
        ];

        return (
            <Router>
                <div className="viewport">
                    <div className="navigation-top">
                        <Navigation links={links}/>
                    </div>

                    <Route exact={true} path="/" component={Stats}/>
                    <Route path="/vnc/" component={Vnc}/>
                </div>
            </Router>
        );
    }
}
