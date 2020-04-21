import styled from "styled-components/macro";

const colorDisconnected = "#ff6e59";
const colorConnecting = "#6883d3";
const colorDisconnecting = " #ca9eff";
const colorFullscreen = "#59a781";
const backgroundColorLighter = "#3d444c";

export const StyledVNC = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    &.fullscreen {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 2;
        top: 0;
        left: 0;
    }

    .vnc-connection-status {
        color: #fff;
        text-transform: uppercase;
        margin-left: 55px;
        transition: color 0.5s ease-out 0s;
        line-height: 20px;

        &:before {
            content: "";
            display: block;
            width: 35px;
            margin-left: -45px;
            border-bottom: 1px solid #fff;
            position: relative;
            top: 11px;
        }

        &_disconnected {
            color: ${colorDisconnected};
            &:before {
                border-bottom-color: ${colorDisconnected};
            }
        }

        &_connecting {
            color: ${colorConnecting};
            &:before {
                border-bottom-color: ${colorConnecting};
            }
        }
    }

    .vnc-card {
        height: 450px;
        width: 100%;
        display: flex;

        &_fullscreen {
            height: 100%;
            width: 100%;
            z-index: 2;
            background-color: ${backgroundColorLighter};
        }

        &_small {
            height: 30px;
            width: 65px;
        }

        &__controls {
            height: 100%;
            width: 50px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: column;

            .control {
                width: 50px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                text-decoration: none;
                font-size: 25px;
                color: #fff;
                transition: background-color 0.5s ease-out 0s;

                &_fullscreen {
                    cursor: pointer;
                }

                &_lock {
                    cursor: pointer;
                }

                &_disconnected {
                    background-color: ${colorDisconnected};
                    height: 30px;
                    width: 30px;
                    line-height: 30px;
                    font-size: 1em;
                    border-radius: 0;
                }

                &_connecting {
                    background-color: ${colorConnecting};
                    height: 30px;
                    width: 30px;
                    line-height: 30px;
                    font-size: 1em;
                    border-radius: 0;
                }

                &_connected {
                    display: none;
                }

                &_disconnecting {
                    background-color: ${colorDisconnecting};
                }
            }
        }

        &__content {
            width: calc(100% - 50px);
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: #000;

            .vnc-screen {
                height: 100%;
            }
        }
    }
`;
