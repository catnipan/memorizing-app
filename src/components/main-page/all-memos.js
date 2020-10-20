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
} from '../ui';
import { parseUTC, formatLocal } from '../../clock';
import { CheckIcon, ReplayIcon } from '../icon';
import useStatus, { Status } from './use-status';
import Stage from './stage';
import updateMemo from './update-memo';

const useStyle = styles.makeStyles(theme => ({
  card: {
    margin: '1em 0',
  },
  createAt: {
    color: theme.palette.grey[300],
    fontWeight: 'bold',
  },
  notYet: {
    margin: '1em 0',
    padding: '2em',
    textAlign: 'center',
  },
  date: {
    flexGrow: 1,
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
  const [tick, tickRes] = useMutation(TickMemoMutation, {
    onCompleted: ({ TickMemo }) => updateMemoData(TickMemo),
  });
  const [reSchedule, reScheduleRes] = useMutation(RescheduleMemoMutation, {
    onCompleted: ({ ReSchedule }) => updateMemoData(ReSchedule),
  });
  const { type, comment } = useStatus(schedule);
  if (type == Status.NotYet) {
    return (
      <Card className={classes.notYet}>
        <Typography variant="h5">
          Congratulations, You're done!
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {comment}
        </Typography>
      </Card>
    )
  }
  return (
    <Card className={classes.card}>
      <LinearProgress
        variant="determinate"
        value={stage * 100 / 6}
        color={type === Status.Expired ? 'secondary' : 'primary'}
      />
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {content.split('\n').map((item, i) => (
          <Typography
            key={`${memoId}-${i}`}
            variant="body2"
            component="p"
          >
            {item}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        <Box className={classes.date}>
          <Typography variant="body2" color="textSecondary" component="p">
            {comment}
          </Typography>
        </Box>
        {type == Status.JustNow && (
          <Button
            variant="contained"
            size="small"
            onClick={() => tick({
              variables: {
                memoId,
              }
            })}
            disabled={tickRes.loading}
          >
            <CheckIcon />
          </Button>
        )}
        {type == Status.Expired && (
          <Button
            variant="contained"
            size="small"
            onClick={() => reSchedule({
              variables: {
                memoId,
              }
            })}
            disabled={reScheduleRes.loading}
          >
            <ReplayIcon />
          </Button>
        )}
      
      </CardActions>
    </Card>
  )
}

export default function AllMemos({ memos }) {
  const classes = useStyle();
  for (let { MemoId, Title, Content, Round, CreatedAt, Stage, Schedule } of memos) {
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
  return (
    <Card className={classes.notYet}>
      <Typography variant="body2" component="p">
        You don't have memo card, try create a new one.
      </Typography>
    </Card>
  )
}