import React from "react";
import { NavLink } from "react-router-dom";
import styled from 'styled-components/macro'


const border = '#353b42';

const Nav = styled.div`
  display: flex;
  flex-wrap: wrap;
  line-height: 30px;
  font-size: 1.0em;
  border-bottom: 1px solid ${border};
  letter-spacing: 1px;
  padding-right: 30px;
  
  .element {
    color: #fff;
    text-decoration: none;
    margin-left: 10px;
  }
  
  .active {
      border-bottom: 1px solid #59a781;
  }
`;

const Navigation = ({ links }) => {
    return (
        <Nav>
            {
                links.map(link => {
                    return (
                        <NavLink exact={link.exact} key={link.href} className="element"
                                 activeClassName="active"
                                 to={link.href}>
                            {link.title}
                        </NavLink>
                    )
                })
            }
        </Nav>
    );
};

export default Navigation;
