import React, {Component} from "react";
import "./style.scss";


export default class Quota extends Component {
    render() {

        const {used, pending, total} = this.props;
        const perc = total > 0 ? ((used + pending) / total * 100).toFixed() : 0;

        return (
            <div className="quota">
                <div className="quota-title">QUOTA</div>
                <div className="quota-numbers">
                    <div className="quota-numbers__used">{used} <span className="quota-numbers__pending">+ {pending}</span></div>
                    <div className="quota-numbers__total">{total}</div>
                </div>
                <div className="quota-percents">
                    {perc}
                    <span className="quota-percents_small">%</span>
                </div>
            </div>
        );
    }
}
