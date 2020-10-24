import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "@apollo/client";
import { HashRouter as Router } from "react-router-dom";
import App from './components/app';
import './style.css';
import client from './graphql-client';
import { initClientTime } from './clock';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

initClientTime();

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  </ApolloProvider>,
document.getElementById('app'));