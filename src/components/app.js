import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from "@apollo/client";
import LogInPage from './login-page';
import MainPage from './main-page';
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, CircularProgress, styles } from './ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ExitToAppIcon } from './icon';
import { GetUserInfoQuery, LogOutMutation, ClientTimeQuery, ServerTimeQuery } from './query';
import { formatLocal, syncClientTime } from '../clock';

function UserInfo({ display }) {
  const userInfoRes = useQuery(GetUserInfoQuery, {
    fetchPolicy: 'network-only',
  });
  const [logout, logoutRes] = useMutation(LogOutMutation);
  
  if (userInfoRes.loading || userInfoRes.error) return null;
  if (logoutRes.data && logoutRes.data.LogoutUser) return <Redirect to="/" />;

  return (
    <>
      <Typography>
        {userInfoRes.data.userInfo.Email}
      </Typography>
      <IconButton color="inherit" onClick={() => logout()}>
        <ExitToAppIcon />
      </IconButton>
    </>
  )
}

const useStyles = styles.makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

export default function App() {
  useQuery(ServerTimeQuery, {
    pollInterval: 1000 * 60 * 60, // sync time 1 hour
    onCompleted: (data) => {
      syncClientTime(data.serverNow);
    },
  });
  const classes = useStyles();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Memorizing
          </Typography>
          <Route path="/main">
            <UserInfo />
          </Route>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/main" />
        </Route>
        <Route path="/login">
          <LogInPage />
        </Route>
        <Route path="/main">
          <MainPage />
        </Route>
      </Switch>
    </Box>
  )
}