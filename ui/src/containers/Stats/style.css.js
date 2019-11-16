import styled from "styled-components/macro";

const borderStatsColor = "#3d444c";
const borderSectionColor = "#353b42";

export const StyledStats = styled.div`
    min-height: 100px;
    min-width: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    overflow: auto;

    .section-title {
        color: #666;
        position: absolute;
        top: 0;
        left: 0;
        padding-left: 5%;
        border-bottom: 1px solid ${borderSectionColor};
        width: 95%;
        letter-spacing: 1px;
        font-size: 10px;
        line-height: 20px;
    }

    .quota {
        border-right: 1px dashed ${borderStatsColor};
        margin-right: 10px;
    }
`;
