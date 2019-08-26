import React from "react";
import PropTypes from "prop-types";
import { StyledStats } from "./style.css";

import Browsers from "../../components/Browsers";

const Stats = ({ state, browsers }) => {
    return (
        <StyledStats>
            <Browsers browsers={browsers} totalUsed={state.used} />
        </StyledStats>
    );
};

Stats.propTypes = {
    state: PropTypes.object,
    browsers: PropTypes.object,
};

export default Stats;
