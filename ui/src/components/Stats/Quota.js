import React from "react";
import styled from "styled-components/macro";

import { StatsElement } from "./StatsElement";

const StyledQuota = styled(StatsElement)`
    width: auto;
    min-width: 115px;

    .numbers {
        flex: 2;
        font-weight: 300;
        font-size: 2em;

        .pending {
            font-size: 0.7em;
            color: #ccc;
        }
    }
`;

const Quota = ({ used, pending, total }) => {
    return (
        <StyledQuota>
            <div className="title">QUOTA</div>
            <div className="numbers">
                {used} <span className="pending">+ {pending}</span> / {total}
            </div>
        </StyledQuota>
    );
};

export default Quota;
