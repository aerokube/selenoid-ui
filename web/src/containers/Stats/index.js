import React, {Component} from "react";
import PropTypes from 'prop-types';
import "./style.scss";

import Quota from "components/Quota";
import Queue from "components/Queue";
import Browsers from "components/Browsers";
import Status from "components/Status";

export default class Stats extends Component {
    static propTypes = {
        sse: PropTypes.string,
        status: PropTypes.string,
        state: PropTypes.object,
        browsers: PropTypes.object
    };

    render() {
        const {sse, status, state, browsers} = this.props;

        return (
            <div className="stats">
                <div className="stats__section-title">
                    Stats
                </div>

                <div className="stats__status">
                    <Status status={sse} title="sse"/>
                    <Status status={status} title="selenoid"/>
                </div>
                <div className="stats__quota">
                    <Quota total={state.total} used={state.used} pending={state.pending}/>
                    <Queue queued={state.queued}/>
                </div>
                <Browsers browsers={browsers} totalUsed={state.used}/>
            </div>
        );
    }
}
