import React from "react";
import styled from "styled-components/macro";
import { StatsElement } from "./StatsElement";

const StyledQueue = styled(StatsElement)`
    width: auto;
    min-width: 45px;
    .used {
        flex: 2;
        font-weight: 300;
        font-size: 2em;

        .small {
            font-size: 0.5em;
            padding-left: 3px;
        }
    }
`;

const Used = ({ used, pending, total }) => {
    const perc = total > 0 ? (((used + pending) / total) * 100).toFixed() : "?";

    return (
        <StyledQueue>
            <div className="title">USED</div>
            <div className="used">
                {perc}
                <span className="small">%</span>
            </div>
        </StyledQueue>
    );
};

export default Used;
