import React from 'react';
import { useQuery } from "@apollo/client";
import { GetUserInfoQuery } from './query';
import { Box, CircularProgress } from './ui';
import { Redirect } from 'react-router-dom';

const mustLogin = Symbol();
const mustLogout = Symbol();

const Auth = type => Component => {
  return function AuthComponent(props) {
    const { data, loading, error } = useQuery(GetUserInfoQuery, {
      fetchPolicy: 'network-only',
    });
    if (loading) return <Box><CircularProgress /></Box>;
    const isLogin = !error;
    if (isLogin) { // if user logs in
      if (type === mustLogout) { // but this page is for not logged in user
        return <Redirect to="/main" />;
      }
    } else { // not login
      if (type === mustLogin) { // unauthorized
        return <Redirect to="/login" />;
      }
    }
    return React.createElement(Component, props);
  }
}

export const MustLogin = Auth(mustLogin);
export const MustLogout = Auth(mustLogout);