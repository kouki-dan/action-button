import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'normalize.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b3e5fc',
    },
    secondary: {
      main: '#00c853',
    },
  },
});

const Home = () => {
  return <div>Home</div>
}

const Repos = () => {
  return <div>Repos</div>
}

const App = () => {
  return <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Action Button
        </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/repos' component={Repos} />
      </Switch>
    </MuiThemeProvider>
  </BrowserRouter>;
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
