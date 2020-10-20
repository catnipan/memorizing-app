import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";
import { Redirect } from 'react-router-dom';
import { GetUserInfoQuery, LoginUserMutation, SignUpAndLogInMutation } from './query';
import { TextField, Button, Paper, Box, Typography, LinearProgress, styles } from './ui'
import { MustLogout } from './auth-hoc';


const Mode = {
  Login: Symbol(),
  SignUp: Symbol(),
}

const useStyle = styles.makeStyles(theme => ({
  box: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: '2em',
  },
  fullWidth: {
    width: '100%',
  },
  formItem: {
    marginBottom: '1em',
  },
  formTitle: {
    marginBottom: '2em',
  }
}));

function LogInPage() {
  const classes = useStyle();
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [mode, updateMode] = useState(Mode.Login);
  const [login, loginRes] = useMutation(LoginUserMutation);
  const [signUpAndLogin, signUpRes] = useMutation(SignUpAndLogInMutation);

  const res = mode === Mode.Login ? loginRes : signUpRes;
  const submit = mode === Mode.Login ? login : signUpAndLogin;

  const onSubmit = () => submit({
    variables: {
      email,
      password,
    }
  });
  const onKeyDown = e => {
    if (e.key == 'Enter') {
      onSubmit();
    }
  };

  return (
    <Box className={classes.box}>
      {res.data && res.data.LoginUser && <Redirect to="/" />}
      <Box width={400}>
        <Paper elevation={2}>
          {res.loading && <LinearProgress />}
          <Box className={classes.container}>
            <Box className={classes.formTitle}>
              <Typography variant="h5" container="h5">
                {mode === Mode.Login ? 'Log In' : 'Sign Up'}
              </Typography>
            </Box>
            <Box className={classes.formItem}>
              <TextField
                className={classes.fullWidth}
                label="Email Address"
                variant="outlined"
                disabled={res.loading}
                error={!!res.error}
                value={email}
                onChange={e => updateEmail(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </Box>
            <Box className={classes.formItem}>
              <TextField
                className={classes.fullWidth}
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                disabled={res.loading}
                error={!!res.error}
                onKeyDown={onKeyDown}
                onChange={e => updatePassword(e.target.value)}
              />
            </Box>
            <Box className={classes.formItem}>
              <Button
                variant="contained"
                color="primary"
                disabled={res.loading}
                className={classes.fullWidth}
                onClick={onSubmit}
              >
                {mode === Mode.Login ? 'Log In' : 'Sign Up'}
              </Button>
            </Box>
            <Box className={classes.formItem}>
              <Button
                className={classes.fullWidth}
                disabled={res.loading}
                onClick={() => updateMode(mode == Mode.Login ? Mode.SignUp : Mode.Login)}
              >
                {mode === Mode.Login ? 'Create a new account' : 'I have an account'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default MustLogout(LogInPage);