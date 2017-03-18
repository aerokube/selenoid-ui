import React, {Component} from "react";
import "./style.scss";


export default class Quota extends Component {
    render() {
        const perc = this.props.total > 0 ? (this.props.used / this.props.total * 100).toFixed() : 0;

        return (
            <div className="quota">
                <div className="quota-title">QUOTA</div>
                <div className="quota-numbers">
                    <div className="quota-numbers__used">{this.props.used}</div>
                    <div className="quota-numbers__total">{this.props.total}</div>
                </div>
                <div className="quota-percents">
                    {perc}
                    <span className="quota-percents_small">%</span>
                </div>
            </div>
        );
    }
}
