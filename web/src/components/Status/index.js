import React, {Component} from "react";
import "./style.scss";


export default class Status extends Component {
    render() {
        return (
            <div className={`status status_${this.props.status}`}></div>
        );
    }
}
