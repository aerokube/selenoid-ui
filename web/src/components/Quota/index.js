import React, {Component} from "react";
import "./style.scss";


export default class Quota extends Component {
    render() {
        return (
            <div className="quota">
                <div className="quota-title">QUOTA</div>
                <div className="quota-numbers">
                    <div className="quota-numbers__used">{this.props.used}</div>
                    <div className="quota-numbers__total">{this.props.total}</div>
                </div>
                <div className="quota-percents">
                    {(this.props.used / this.props.total * 100).toFixed()}
                    <span className="quota-percents_small">%</span>
                </div>
            </div>
        );
    }
}
