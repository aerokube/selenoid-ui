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

const Quota = ({ used = "?", pending = "?", total = "?" }) => {
    return (
        <StyledQuota>
            <div className="title">QUOTA</div>
            <div className="numbers">
                <span title="Used">{used}</span>{" "}
                <span className="pending" title="Pending (Starting...)">
                    + {pending}
                </span>{" "}
                / <span title="Total">{total}</span>
            </div>
        </StyledQuota>
    );
};

export default Quota;
