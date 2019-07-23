import styled from 'styled-components/macro'

const termBg = '#151515';
const lightFont = '#999';

export const StyledLog = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  &.hidden-true {
    display: none;
  }

  .log-card {
    height: 450px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    &__content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: ${termBg};

      .term {
        height: calc(100% - 30px);
        padding: 20px 20px 10px;

        .terminal {
          color: #fff;
          font-family: "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 13px;
          line-height: 20px;

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;

          .xterm-viewport {
            background-color: ${termBg};
          }
        }
      }
    }
  }

  .log-info {
    display: inline-flex;
    margin: auto;
    justify-content: center;
    line-height: 20px;
    width: 200px;
    color: ${lightFont};

    &__version-separator {
      margin-right: 4px;
      margin-left: 4px;
      font-size: 0.6em;
      color: #fff;
    }

    &__session {
      line-height: 20px;
      font-size: 0.8em;
      color: ${lightFont};
      text-align: center;
    }
  }
`;