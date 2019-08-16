import styled, { createGlobalStyle } from "styled-components/macro";

const bgColor = "#30363C";

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
`;

export const StyledViewport = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StyledTopBar = styled.div`
    display: flex;
    justify-content: flex-end;
`;
