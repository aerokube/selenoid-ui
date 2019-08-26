import styled from "styled-components/macro";

const backgroundColorLighter = "#3d444c";
const colorSessionName = "#555f6a";

export const StyledSession = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .interactive {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
    }

    .session-interactive-card {
        max-width: 1000px;
        flex: 1;
        flex-basis: 45%;
        min-width: 450px;
        margin: 20px 0 0;
    }

    .session-info {
        color: #fff;
        padding: 0 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80px;
        margin-bottom: 30px;

        &__main {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 350px;
            border-bottom: 1px dashed ${backgroundColorLighter};
            margin: 15px 0;
            flex-shrink: 0;

            .session-browser {
                line-height: 40px;
                display: inline-flex;

                &__name {
                    text-transform: uppercase;
                    font-weight: 200;
                }

                &__version-separator {
                    margin-right: 3px;
                    margin-left: 3px;
                    font-size: 1.5em;
                    color: ${backgroundColorLighter};
                }

                &__version {
                    font-size: 0.8em;
                }

                &__quota {
                    font-size: 0.8em;
                    color: #999;
                }

                &__resolution {
                    font-size: 0.8em;
                    color: #999;
                }
            }
        }

        &__additional {
            .custom-capabilities {
                &__name {
                    height: 25px;
                    line-height: 25px;
                    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.12);
                    margin: -3px 5px 0;
                    padding: 0 5px;

                    background-color: ${colorSessionName};
                    font-family: "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace;

                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    font-size: 13px;
                }
            }
        }
    }
`;
