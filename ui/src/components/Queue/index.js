import React from "react";
import "./style.scss";


const Queue = ({ queued }) => {
    return (
        <div className="queue">
            <div className="queue-title">QUEUED</div>
            <div className="queue-queued">
                {queued}
            </div>
        </div>
    );
};

export default Queue;
