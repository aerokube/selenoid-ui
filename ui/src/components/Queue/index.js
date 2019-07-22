import React from "react";
import { StyledQueue } from "./style.css";


const Queue = ({ queued }) => {
    return (
        <StyledQueue>
            <div className="title">QUEUED</div>
            <div className="queued">{queued}</div>
        </StyledQueue>
    );
};

export default Queue;
