import React, {Component} from "react";
import "./style.scss";


export default class Status extends Component {
    render() {
        const {status, title} = this.props;

        return (
            <div className="status">
                <div className={`indicator indicator_${status}`}>{title}</div>
            </div>
        );
    }
}
