import styled from "styled-components/macro";

export const StyledQuota = styled.div`
    width: 180px;
    color: #fff;
    display: flex;
    flex-wrap: wrap;

    .title {
        width: 100%;
        line-height: 20px;
        height: 20px;
        letter-spacing: 1px;
    }

    .percents {
        font-size: 4em;
        font-weight: 100;
        text-align: right;

        &_small {
            font-size: 0.6em;
        }
    }

    .numbers {
        align-self: center;
        padding-right: 10px;
        text-align: center;

        .used {
            border-bottom: 1px solid #fff;
        }

        .pending {
            font-size: 0.7em;
            color: #ccc;
        }
    }
`;
