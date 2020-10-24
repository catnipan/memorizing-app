import React, { memo } from 'react';
import { useMutation } from "@apollo/client";
import { GetAllMemoQuery, TickMemoMutation, RescheduleMemoMutation } from '../query';
import {
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Typography,
  styles,
  LinearProgress,
  Button,
  Box,
  Fab,
} from '../ui';
import ReactMarkdown from "react-markdown";
import { useTransition, useSpring, animated } from 'react-spring';
import { parseUTC, formatLocal } from '../../clock';
import { CheckIcon, ReplayIcon } from '../icon';
import useStatus, { Status } from './use-status';
import Stage from './stage';
import updateMemo from './update-memo';
import useCountDown from './use-countdown';

const useStyle = styles.makeStyles(theme => ({
  wrapper: {
    maxWidth: '40em',
    margin: '2em auto 0',
  },
  card: {
    position: 'relative',
  },
  expired: {
    filter: 'blur(0.6px) opacity(0.2)',
    zIndex: -1,
    pointerEvents: 'none',
  },
  expiredNotice: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    minHeight: '20em',
  },
  createAt: {
    color: theme.palette.grey[300],
    fontWeight: 'bold',
  },
  action: {
    backgroundColor: theme.palette.grey[100],
  },
  notYet: {
    margin: '2em auto',
    maxWidth: '40em',
    padding: '2em',
    textAlign: 'center',
  },
  date: {
    flexGrow: 1,
  },
  btnContainer: {
    textAlign: 'center',
    paddingTop: '2em',
  },
  btnIcon: {
    marginRight: '0.3em',
  },
}));

const updateMemoData = ({ MemoId, Round, Stage, Schedule }) => {
  updateMemo(memos => memos.map(memo => {
    if (memo.MemoId == MemoId) {
      return {
        ...memo,
        Round,
        Stage,
        Schedule
      }
    }
    return memo;
  }));
}

function Memo({ title, memoId, content, stage, createdAt, schedule }) {
  const classes = useStyle();
  const [countdown, resetCd] = useCountDown(5);
  const [tick, tickRes] = useMutation(TickMemoMutation, {
    onCompleted: ({ TickMemo }) => updateMemoData(TickMemo),
  });
  const [reSchedule, reScheduleRes] = useMutation(RescheduleMemoMutation, {
    onCompleted: ({ ReSchedule }) => updateMemoData(ReSchedule),
  });
  const { opacity, scale } = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
  });
  const style = {
    opacity,
    transform: scale.interpolate(x => `scale(${x})`),
  };
  const { type, comment } = useStatus(schedule);
  if (type == Status.NotYet) {
    return (
      <animated.div className={classes.notYet} style={style}>
        <Typography variant="h5">
          Congratulations, You're good for now!
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {comment}
        </Typography>
      </animated.div>
    )
  }
  return (
    <animated.div className={classes.wrapper} style={style}>
      <Card className={classes.card}>
        <Box className={type === Status.Expired ? `${classes.expired}` : ''}>
          <LinearProgress
            variant="determinate"
            value={stage / 6 * 100}
          />
          <CardContent className={classes.content}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </CardContent>
          <CardActions className={classes.action}>
            {type == Status.JustNow && (
              <Typography variant="body2">
                {comment}
              </Typography>
            )}
          </CardActions>
        </Box>
        {type === Status.Expired && (
          <Box className={classes.expiredNotice}>
            <Typography>
              {comment}
            </Typography>
          </Box>
        )}
      </Card>
      <Box className={classes.btnContainer}>
        {type === Status.Expired && (
          <Fab
            color="secondary"
            aria-label="reschedule"
            variant="extended"
            onClick={() => reSchedule({
              variables: {
                memoId,
              }
            })}
          >
            <ReplayIcon className={classes.btnIcon} />
            Reschedule
          </Fab>
        )}
        {type === Status.JustNow && (
          <Fab
            color="primary"
            aria-label="reschedule"
            disabled={countdown != 0}
            onClick={() => tick({
              variables: {
                memoId,
              }
            })}
          >
            {countdown == 0 ? <CheckIcon /> : countdown}
          </Fab>
        )}
      </Box>
    </animated.div>
  )
}

export default function AllMemos({ memos }) {
  const classes = useStyle();
  
  if (memos.length === 0) {
    return (
      <Box className={classes.notYet}>
        <Typography variant="h5" component="p">
          You don't have any active memo Card
        </Typography>
        <Typography variant="body2">
          try create a new one.
        </Typography>
      </Box>
    )
  }

  const { MemoId, Title, Content, Round, CreatedAt, Stage, Schedule } = memos[0];
  return (
    <Memo
      key={MemoId}
      memoId={MemoId}
      title={Title}
      content={Content}
      createdAt={CreatedAt}
      stage={Stage}
      schedule={Schedule}
    />
  );
}