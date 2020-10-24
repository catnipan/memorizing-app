import React from 'react';
import { useQuery } from "@apollo/client";
import { Box, styles, CircularProgress } from '../ui';
import NewMemo from './new-memo';
import AllMemos from './all-memos';
import Statistics from './statistics';
import { GetAllMemoQuery } from '../query';
import updateMemo from './update-memo';

const useStyle = styles.makeStyles(theme => ({
  wrapper: {
    height: '100vh',
    position: 'relative',
    padding: '64px 1em 0 1em',
    boxSizing: 'border-box',
  },
  main: {
    position: 'relative',
  }
}));

function MainPage() {
  const classes = useStyle();
  const { loading, data, error } = useQuery(GetAllMemoQuery, {
    onCompleted: () => updateMemo(x => x), // make it sorted
  });
  if (error) return 'error';
  if (loading) return <CircularProgress />;
  return <Box className={classes.wrapper}>
      <Box className={classes.main}>
        <NewMemo />
        <AllMemos memos={data.memos} />
      </Box>
      <Statistics memos={data.memos} />
    </Box>
}

export default MainPage;
