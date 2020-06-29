import styled from "styled-components/macro";

const contentBgColor = "#131614";
const colorBorder = "#555f6a";
const colorAccent = "#59a781";
const colorDelete = "#ff6e59";

const borderLangsColor = "#3d444c";
const borderSectionColor = "#353b42";
const selectedColor = "#dd6d6d";
const errorColor = "#ff6e59";
const grayColor = "#666";

export const StyledVideo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 45%;
    padding: 10px 20px;
    margin-bottom: 30px;
    max-width: 70%;

    &:hover {
        .video {
            .controls {
                visibility: visible;
            }
        }
    }

    .name {
        color: #fff;
        font-size: 1.3em;
        font-weight: 300;
        padding: 0 5px 10px 0;
        border-bottom: 1px dashed ${colorBorder};
        overflow-y: scroll;
        line-height: 30px;
        height: 30px;
    }

    .video {
        display: flex;
        flex: 1;
        min-width: 300px;
        min-height: 300px;

        .controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 0;
            flex-basis: 40px;
            color: #fff;
            visibility: hidden;

            .control {
                flex-basis: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                border-bottom: 1px dashed ${colorBorder};

                a {
                    text-decoration: none;
                    color: #fff;

                    &:hover {
                        color: ${colorAccent};
                    }
                }

                .delete {
                    cursor: pointer;
                    &:hover {
                        color: ${colorDelete};
                    }
                }
            }
        }

        .content {
            display: flex;
            flex: 1;
            padding: 5px;
            flex-basis: 300px;
            background-color: ${contentBgColor};
            justify-content: center;
            align-items: center;

            video {
                width: 100%;
                height: 100%;
            }
        }
    }
`;

export const StyledVideos = styled.div`
    .videos__list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .video__container {
        //TRANSITIONS
        &_state-enter {
            opacity: 0.01;
        }

        &_state-enter-active {
            opacity: 1;
            transition: opacity 500ms ease-in;
        }

        &_state-exit {
            opacity: 1;
        }

        &_state-exit-active {
            opacity: 0.01;
            transition: opacity 500ms ease-out;
        }
    }

    .no-any {
        color: #fff;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
        font-size: 1.2em;
        justify-content: center;

        .nosession-any-text {
            margin: 10px;
        }

        // don't show until all videos are gone
        &_state-enter-active {
            display: none;
        }
    }
`;

export const DeleteAll = styled.div`
    padding: 10px 20px;
    .delete-all {
        height: 2rem;
        border: 1px solid ${selectedColor};
        border-radius: 3px;
        background-color: ${borderSectionColor};
        color: ${selectedColor};
        text-transform: uppercase;
        font-size: 1.1em;
        outline: none;
        cursor: pointer;

        &:disabled {
            border-color: ${grayColor};
            background-color: ${grayColor};
            color: ${grayColor};
        }

        &.error-true {
            border-color: ${errorColor};
            color: ${errorColor};
        }
    }
`;
