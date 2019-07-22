import React from "react";
import PropTypes from 'prop-types';
import "./style.scss";

import Quota from "../../components/Quota";
import Queue from "../../components/Queue";
import Browsers from "../../components/Browsers";

const Stats = ({ state, browsers }) => {
    return (
        <div className="stats">
            <div className="stats__section-title">
                Stats
            </div>

            <div className="stats__quota">
                <Quota total={state.total} used={state.used} pending={state.pending}/>
                <Queue queued={state.queued}/>
            </div>
            <Browsers browsers={browsers} totalUsed={state.used}/>
        </div>
    );
};

Stats.propTypes = {
    state: PropTypes.object,
    browsers: PropTypes.object,
};

export default Stats;