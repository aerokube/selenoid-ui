import React, {Component} from "react";
import "./style.scss";


export default class Queue extends Component {
    render() {
        const {queued} = this.props;

        return (
            <div className="queue">
                <div className="queue-title">QUEUED</div>
                <div className="queue-queued">
                    {queued}
                </div>
            </div>
        );
    }
}
