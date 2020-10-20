import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "@apollo/client";
import { HashRouter as Router } from "react-router-dom";
import App from './components/app';
import './style.css';
import client from './graphql-client';
import { initClientTime } from './clock';
import { SnackbarProvider } from 'notistack';

initClientTime();

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </Router>
  </ApolloProvider>,
document.getElementById('app'));