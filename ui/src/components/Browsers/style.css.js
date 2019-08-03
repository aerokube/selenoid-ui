import styled from "styled-components/macro";

export const StyledBrowsers = styled.div`
    color: #fff;
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 150px;
`;

export const StyledBrowser = styled.div`
    width: 100%;
    overflow: hidden;
    display: inline-flex;
    line-height: 30px;
    position: relative;

    .stats {
        display: flex;

        .name {
            overflow: hidden;
            letter-spacing: 1px;
        }

        .count {
            font-size: 2em;
            width: 80px;
        }

        .percent {
            font-size: 0.8em;
            line-height: 20px;
            width: 30px;
            padding-left: 5px;
        }
    }

    .usage-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1px dashed;
        transition: all 300ms ease-in;
    }
`;
