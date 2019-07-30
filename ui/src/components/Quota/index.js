import React from "react";
import {StyledQuota} from "./style.css";


const Quota = ({ used, pending, total }) => {
    const perc = total > 0 ? ((used + pending) / total * 100).toFixed() : 0;

    return (
        <StyledQuota>
            <div className="title">QUOTA</div>
            <div className="numbers">
                <div className="used">{used} <span className="pending">+ {pending}</span>
                </div>
                <div className="total">{total}</div>
            </div>
            <div className="percents">
                {perc}
                <span className="percents_small">%</span>
            </div>
        </StyledQuota>
    );
};

export default Quota;