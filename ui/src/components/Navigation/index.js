import React from "react";
import { NavLink } from "react-router-dom";

import "./style.scss";


const Navigation = ({ links }) => {
    return (
        <div className="nav">
            {
                links.map(link => {
                    return (
                        <NavLink exact={link.exact} key={link.href} className="nav__element"
                                 activeClassName="nav__element_active"
                                 to={link.href}>
                            {link.title}
                        </NavLink>
                    )
                })
            }
        </div>
    );
};

export default Navigation;
