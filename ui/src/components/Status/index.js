import React from "react";
import "./style.scss";


const Status = (props) => {
        const {status, title} = props;

        return (
            <div className="status">
                <div className={`indicator indicator_${status}`}>{title}</div>
            </div>
        );
};

export default Status;
