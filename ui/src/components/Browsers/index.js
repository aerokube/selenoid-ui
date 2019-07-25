import React from "react";

import PropTypes from "prop-types"
import { StyledBrowsers } from "./style.css";
import Browser from "./Browser";

function descendingCount(browsers) {
    return Object.keys(browsers)
        .sort((a, b) => browsers[b] - browsers[a])
        .map(name => ({
            name,
            used: browsers[name]
        }));
}

const Browsers = ({ totalUsed, browsers }) => {
    return (
        <StyledBrowsers>
            {descendingCount(browsers).map(browser => (
                <Browser key={browser.name} totalUsed={totalUsed} {...browser}/>
            ))}
        </StyledBrowsers>
    );
};

Browsers.propTypes = {
    totalUsed: PropTypes.number.isRequired,
    browsers: PropTypes.object.isRequired,
};

export default Browsers;
