import React from "react";
import styled from "styled-components/macro";
import { StatsElement } from "./StatsElement";

const brightGreen = "#57ff76";
const brightRed = "#FF5757";

const StyledStatus = styled(StatsElement)`
    .indicator {
        height: 80px;
        transition: all 0.5s ease-out 0.2s;
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        justify-content: center;

        box-shadow: inset 0px -8px 5px -10px #ffffff;

        &_ok {
            .status {
                color: ${brightGreen};
            }

            box-shadow: inset 0px -9px 5px -10px ${brightGreen};
        }

        &_error {
            .status {
                color: ${brightRed};
            }

            box-shadow: inset 0px -10px 5px -10px ${brightRed};
        }

        .status {
            flex: 1;
            font-weight: 300;
        }
    }
`;

const state = status => {
    switch (status) {
        case "ok":
            return "CONNECTED";
        case "error":
            return "ISSUE";
        default:
            return "UNKNOWN";
    }
};

const Status = ({ status = "unknown", title }) => {
    return (
        <StyledStatus>
            <div className={`indicator indicator_${status}`}>
                <div className="title">{title}</div>
                <div className="status">{state(status)}</div>
            </div>
        </StyledStatus>
    );
};

export default Status;
