import React from 'react';
import { useQuery } from "@apollo/client";
import { Box, styles, CircularProgress } from '../ui';
import NewMemo from './new-memo';
import AllMemos from './all-memos';
import { MustLogin } from '../auth-hoc';
import Statistics from './statistics';
import { GetAllMemoQuery } from '../query';
import updateMemo from './update-memo';

const useStyle = styles.makeStyles(theme => ({
  wrapper: {
    width: '60em',
    margin: '2em auto',
  },
}));

function MainPage() {
  const classes = useStyle();
  const { loading, data, error } = useQuery(GetAllMemoQuery, {
    onCompleted: () => updateMemo(x => x), // make it sorted
  });
  if (error) return 'error';
  if (loading) return <CircularProgress />;
  return <Box className={classes.wrapper}>
      <Statistics memos={data.memos} />
      <NewMemo />
      <AllMemos memos={data.memos} />
    </Box>
}

export default MustLogin(MainPage);
