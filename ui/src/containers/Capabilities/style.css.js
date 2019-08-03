import styled from "styled-components/macro";

const borderLangsColor = "#3d444c";
const borderSectionColor = "#353b42";
const unselectedColor = "#376e52";
const selectedColor = "#59a781";
const errorColor = "#ff6e59";
const grayColor = "#666";

const selectBgColor = "#30363C";

export const StyledCapabilities = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;

  .section-title {
    color: ${grayColor};
    position: relative;
    top: 0;
    left: 0;
    padding-left: 5%;
    border-bottom: 1px solid ${borderSectionColor};
    width: 95%;
    letter-spacing: 1px;
    font-size: 10px;
    line-height: 20px;
  }

  .setup {
    width: 200px;
    margin-right: 30px;

    button {
      width: 100%;
      margin-top: 10px;
      cursor: pointer;
    }
    
    
    .Select-control {
    background-color: inherit;
    border-radius: 0;
    border: none;
    color: #fff;
    height: 30px;

    &:hover {
      box-shadow: none;
    }

    & .Select-input {
      outline: none;

      input {
        color: #fff;
      }
    }
  }

    .has-value.Select--single > .Select-control .Select-value .Select-value-label,
    .has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label {
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  
    .Select-menu-outer {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      background-color: inherit;
      border: 0;
      box-shadow: none;
    }
  
    .Select-option {
      background-color: ${selectBgColor};
      color: #ccc;
      text-transform: uppercase;
    }
    .Select-option:last-child {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
    .Select-option.is-selected {
      background-color: ${selectBgColor};
      color: ${selectedColor};
    }
    .Select-option.is-focused {
      background-color: ${selectBgColor};
      color: ${selectedColor};
    }
  
  }

  .lang-selector {
    height: 160px;
    margin-left: 50px;
    margin-top: 20px;
  }

  .new-session {
    height: 2rem;
    border: 1px solid ${unselectedColor};
    border-radius: 3px;
    background-color: ${borderSectionColor};
    color: ${selectedColor};
    text-transform: uppercase;
    font-size: 1.1em;
    outline: none;

    &:hover {
      border-color: ${selectedColor};
      background-color: ${borderLangsColor};
    }

    &.disabled-true {
      border-color: ${borderLangsColor};
      background-color: ${borderLangsColor};
      color: ${grayColor};

      &:hover {
        border-color: ${borderLangsColor};
        cursor: default;
      }
    }
    
     &.error-true {
      border-color: ${errorColor};
      color: ${errorColor};
    }
  }

}

pre.hljs, code.hljs {
  font-family: "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.2;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: inherit;
}

.capabilities-langs {
  border-left: 1px dashed ${borderLangsColor};
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.capabilities-lang {
  color: #fff;
  padding: 10px;
  text-transform: capitalize;
  line-height: 20px;
  border-left: 3px solid ${borderLangsColor};
  cursor: pointer;
  transition: border-color 0.2s ease-out 0s;
  min-width: 80px;

  &_active {
    border-left-color: ${selectedColor};
  }
}
`;
