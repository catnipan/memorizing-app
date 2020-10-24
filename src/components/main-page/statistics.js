import React, { useState } from 'react';
import { useQuery } from "@apollo/client";
import { ResponsiveBar } from '@nivo/bar'
import { Box, styles } from '../ui';
import { ClientTimeQuery } from '../query'
import { parseUTC } from '../../clock';
import { Typography } from '@material-ui/core';

let lastToday;
let lastMemos;
let ans;

function calculateData(clientNow, memos) {
  let today = clientNow.format("MM-DD")
  if (today !== lastToday || memos !== lastMemos) {
    console.log('recalculate!');
    const dateCount = {};
    
    const today = clientNow.format('MM-DD');
    for (let i = -15; i <= 15; ++i) {
      dateCount[clientNow.add(i, 'day').format("MM-DD")] = 0;
    }

    memos.forEach(({ Stage, Schedule }) => {
      const day = parseUTC(Schedule);
      for (let i = 0; i < s.length; ++i) {
        const date = day.add(s[i] - s[Stage], 'day').format("MM-DD");
        if (dateCount[date] != undefined) {
          dateCount[date]++;
        }
      }
    });
    ans = [];
    for (const [date, count] of Object.entries(dateCount)) {
      const isToday = date === today;
      ans.push({
        date,
        todayCount: isToday ? count : 0,
        todayCountColor: `hsl(65, 70%, 50%)`,
        otherdayCount: isToday ? 0 : count,
        otherdayCountColor: `hsl(8, 70%, 50%)`,
        isToday,
      })
    }
    lastToday = today;
    lastMemos = memos;
  }
  return ans;
}

const useStyle = styles.makeStyles(theme => ({
  box: {
    minHeight: '100vh',
    width: '100%',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -100,
  },
}));

const s = [0,1,2,4,7,15]
export default function Statistics({ memos }) {
  const { data: { clientNow } } = useQuery(ClientTimeQuery);
  const data = calculateData(clientNow, memos);
  const classes = useStyle();
  return <Box className={classes.box}>
      <ResponsiveBar
        data={data}
        keys={['otherdayCount', 'todayCount']}
        indexBy="date"
        margin={{ top: 60, right: 0, bottom: 0, left: 0 }}
        padding={0}
        colors={{ scheme: 'nivo' }}
        axisTop={null}
        axisRight={null}
        axisLeft={null}
        axisBottom={null}
        enableGridY={false}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        maxValue={40}
        enableLabel={true}
        labelTextColor="#FDF2D4"
        isInteractive={false}
      />
    </Box>
}