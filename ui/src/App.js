import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Viewport from "./containers/Viewport";

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#59a781',
      }
    },
    overrides: {
      MuiButton: {
        outlined: {
          '&$disabled': {
            color: '#818386',
            borderColor: '#818386',
          },
        },

      },
    },
  },
)
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Viewport/>
      </MuiThemeProvider>
    );
  }
}

export default App;

