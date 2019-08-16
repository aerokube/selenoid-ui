import styled from "styled-components/macro";

const colorAccent = "#59a781";
const colorSessionName = "#555f6a";
const borderSectionColor = "#353b42";

export const StyledSessions = styled.div`
  width: 100%;

  .section-title {
    color: #666;
    position: relative;
    top: 0;
    left: 0;
    padding-left: 5%;
    border-bottom: 1px solid ${borderSectionColor};
    width: 95%;
    letter-spacing: 1px;
    font-size: 10px;
    line-height: 20px;
    margin-bottom: 20px;
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

    // don't show until all sessions are gone
    &_state-enter-active {
      display: none;
    }
  }
}

.sessions__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 94%;
  padding-left: 3%;
  padding-right: 3%;

  .session-container {
    flex: 0 0 auto;
    transition: all 0.5s;
    flex-basis: 100%;
      max-width: 100%;

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

  .session-link {
    display: flex;
    justify-content: space-between;
    color: #fff;
    text-decoration: none;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .12), 0 1px 4px rgba(0, 0, 0, .12);
    margin: 5px;
    background-color: #222;
    min-width: 350px;
    
    &_manual {
          border: 1px solid ${colorSessionName};
    }

    .browser {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 60px;

      .name {
        text-transform: uppercase;
        font-weight: 200;
        margin-left: 20px;
        margin-right: 10px;
      }

      .version {
        font-weight: 300;
        text-transform: lowercase;
        font-size: 0.8em;
        color: #999;
      }
    }

    .capability {
      height: 30px;
      line-height: 30px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, .12), 0 1px 4px rgba(0, 0, 0, .12);
      margin: -3px 5px 0;
      padding: 0 5px;

      &__name {
        overflow: hidden;
        background-color: ${colorSessionName};
        font-family: "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace;

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 13px;
      }

      &__with-vnc {
        background-color: ${colorAccent};
        padding: 0 10px;
        line-height: 30px;
        width: 45px;
        text-align: center;
      }

      &__session-delete {
        margin-left: auto;
        margin-right: 0;
        color: #fff;
        height: 30px;
        width: 25px;
        background: rgb(232, 120, 111);
        border: none;
        padding: 3px;
        text-align: center;
        cursor: pointer;
        &:focus {
          outline: none;
        }
      }
    }
  }
`;
