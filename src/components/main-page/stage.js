import React from 'react';
import { styles, Box } from '../ui';

const useStyle = styles.makeStyles(theme => ({
  outer: {
    background: theme.palette.grey[200],
    height: '0.5em',
    borderRadius: '1em',
  },
  inner: {
    background: theme.palette.success.main,
    height: '0.5em',
    borderRadius: '1em',
  }
}));

export default function Stage({ total, current, width }) {
  const style = useStyle();
  return (
    <Box className={style.outer} width={width}>
      <Box className={style.inner} width={width * current / total} />
    </Box>
  )
}