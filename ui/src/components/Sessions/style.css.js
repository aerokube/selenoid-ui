import styled from "styled-components/macro";

const colorAccent = "#59a781";
const colorBorder = "#555f6a";
const borderSectionColor = "#353b42";
const secondaryColor = "#aaa";
const manualColor = "#F0A202";

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
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 50px;

  .session {
    transition: all 0.5s;
    max-width: 100%;
    min-height: 60px;
    display: flex;
    min-width: 350px;
    border-bottom: 1px dashed ${colorBorder};
    color: #fff;
    padding: 10px 0 0;

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
    
    .identity {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: #fff;
      max-width: 50%;
      flex: 0 0 50%;
      padding-right: 15px;
      
      .browser {
        display: flex;

        .name {
          text-transform: uppercase;
          font-weight: 300;
          line-height: 30px;
        }
        
        .version {
          font-weight: 300;
          text-transform: lowercase;
          font-size: 0.8em;
          color: ${secondaryColor};
          margin-left: 5px;
        }
      }
      
      .session-name {
        overflow: hidden;
        border-left: 2px solid ${colorBorder};
        color: ${secondaryColor};
        font-family: "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace;

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding-left: 5px;
      }
    }
    
    &_manual {
    }

    

    .capability {
      padding: 2px 5px;
      background-color: ${colorAccent};
      margin: 3px;
      border-radius: 2px;
      font-weight: 300;
      
      &__manual {
        background-color: ${manualColor};
        color: ${borderSectionColor};
      }
      
      &__resolution {
        background: none;
        color: ${secondaryColor};
      }

      &__session-delete {
        background: none;
        cursor: pointer;
      }
    }
  }
`;
