import styled from "styled-components/macro";

export const StyledQueue = styled.div`
    width: 110px;
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;

    .title {
        width: 100%;
        line-height: 20px;
        height: 20px;
        letter-spacing: 1px;
    }

    .queued {
        width: 100%;
        font-size: 3em;
        font-weight: 100;
        text-align: right;
    }
`;
