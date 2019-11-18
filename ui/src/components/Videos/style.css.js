import styled from "styled-components/macro";

const contentBgColor = "#131614";
const colorBorder = "#555f6a";
const colorAccent = "#59a781";

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
