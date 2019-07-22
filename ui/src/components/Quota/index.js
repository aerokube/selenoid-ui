import React from "react";
import "./style.scss";


const Quota = ({ used, pending, total }) => {
    const perc = total > 0 ? ((used + pending) / total * 100).toFixed() : 0;

    return (
        <div className="quota">
            <div className="quota-title">QUOTA</div>
            <div className="quota-numbers">
                <div className="quota-numbers__used">{used} <span className="quota-numbers__pending">+ {pending}</span>
                </div>
                <div className="quota-numbers__total">{total}</div>
            </div>
            <div className="quota-percents">
                {perc}
                <span className="quota-percents_small">%</span>
            </div>
        </div>
    );
};

export default Quota;