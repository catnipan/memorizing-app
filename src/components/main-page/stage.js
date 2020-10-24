import { Typography } from '@material-ui/core';
import React from 'react';
import { useSpring, animated } from 'react-spring';
import { styles, Box } from '../ui';

const useStyle = styles.makeStyles(theme => ({
  outer: {
    background: theme.palette.grey[200],
    height: '1em',
    borderRadius: '1em',
  },
  inner: {
    background: theme.palette.secondary.main,
    height: '1em',
    borderRadius: '1em',
    textAlign: 'right',
  }
}));

export default function Stage({ total, current, width }) {
  const style = useStyle();
  const props = useSpring({
    from: { width: 0 },
    to: { width: current / total * width }
  });
  return (
    <Box className={style.outer} width={width}>
      <animated.div className={style.inner} style={props} />
    </Box>
  )
}