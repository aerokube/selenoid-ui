import React, {Component} from "react";
import {NavLink} from "react-router-dom";

import "./style.scss";


export default class Navigation extends Component {
    render() {
        const {links} = this.props;

        return (
            <div className="nav">
                {
                    links.map(link => {
                        return (
                            <NavLink exact key={link.href} className="nav__element"
                                     activeClassName="nav__element_active"
                                     to={link.href}>
                                {link.title}
                            </NavLink>
                        )
                    })
                }
            </div>
        );
    }
}
