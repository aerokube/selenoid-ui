import React from "react";
import styled from "styled-components/macro";

const brightGreen = "#57ff76";
const brightRed = "#FF5757";

const StyledStatus = styled.div`
    .indicator {
        height: 80px;
        transition: all 0.5s ease-out 0.2s;
        text-transform: uppercase;
        color: #fff;
        width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 15px;

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

        .title {
            padding-top: 10px;
            font-size: 0.8em;
            flex: 1;
        }

        .status {
            flex: 1;
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
