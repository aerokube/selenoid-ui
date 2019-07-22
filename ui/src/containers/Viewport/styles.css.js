import styled, {createGlobalStyle } from "styled-components/macro";

const bgColor = '#30363C';
const menuBorderBottomColor = '#353b42';

export const GlobalStyle = createGlobalStyle`
html,
  body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin: 0 auto;
  background: ${bgColor};
  font-weight: 100;
}

#root {
  height: 100%;
  width: 100%;
}
`;

export const StyledViewport = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    position: relative;
    padding-top: 60px;
    flex-direction: column;
`;

export const StyledTopBar = styled.div`
    position: absolute;
    top: 10px;
    width: 100%;
    z-index: 1;
    display: inline-flex;
    justify-content: space-between;
`;

export const StyledConnectionStatus = styled.div`
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px solid ${menuBorderBottomColor};
`;


