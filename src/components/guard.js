import React from 'react';
import { useQuery } from "@apollo/client";
import { GetUserInfoQuery } from './query';
import { Box, CircularProgress } from './ui';
import { Redirect } from 'react-router-dom';

export const mustLogin = Symbol();
export const mustLogout = Symbol();

export default function Guard({ type, children }) {
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
  return children;
}