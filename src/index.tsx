import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/react-hooks';
import 'normalize.css'
import Home from './Home';
import Repos from './Repos'
import { client } from "./apolloClient";

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

const Repo = withRouter((props: RouteComponentProps<{org: string, name: string}>) => {
  return <div>repo: {props.match.params.org}/{props.match.params.name}</div>
})

const App = () => {
  return <BrowserRouter>
    <ApolloProvider client={client}>
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
          <Route exact path='/repos/:org/:name' component={Repo} />
        </Switch>
      </MuiThemeProvider>
    </ApolloProvider>
  </BrowserRouter>;
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
