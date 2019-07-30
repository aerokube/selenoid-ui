import React from "react";
import { StyledStatus } from "./style.css";

const Status = ({ status = "unknown", title }) => {
    return (
        <StyledStatus>
            <div className={`indicator indicator_${status}`}>{title}</div>
        </StyledStatus>
    );
};

export default Status;
