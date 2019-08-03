import React from "react";
import PropTypes from "prop-types";
import { StyledStats } from "./style.css";

import Quota from "../../components/Quota";
import Queue from "../../components/Queue";
import Browsers from "../../components/Browsers";

const Stats = ({ state, browsers }) => {
    return (
        <StyledStats>
            <div className="section-title">Stats</div>

            <div className="quota">
                <Quota total={state.total} used={state.used} pending={state.pending} />
                <Queue queued={state.queued} />
            </div>
            <Browsers browsers={browsers} totalUsed={state.used} />
        </StyledStats>
    );
};

Stats.propTypes = {
    state: PropTypes.object,
    browsers: PropTypes.object,
};

export default Stats;
