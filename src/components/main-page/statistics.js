import React from 'react';
import { Paper } from '../ui';
import { Chart, LineAdvance } from 'bizcharts';
import { parseUTC } from '../../clock';
import { useQuery } from '@apollo/client';
import { ClientTimeQuery } from '../query';


let lastToday;
let lastMemos;
let ans;

function calculateData(clientNow, memos) {
  let today = clientNow.format("MM-DD")
  if (today !== lastToday || memos !== lastMemos) {
    console.log('recalculate!');
    const dateCount = {};
    
    for (let i = 0; i <= 15; ++i) {
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
    for (const [date, review] of Object.entries(dateCount)) {
      ans.push({
        date,
        review,
        city: 'review work load schedule'
      })
    }
    lastToday = today;
    lastMemos = memos;
  }
  return ans;
}

const s = [0,1,2,4,7,15]
export default function Statistics({ memos }) {
  const { data: { clientNow } } = useQuery(ClientTimeQuery);
  
  return (
    <Paper>
      <Chart padding={[10, 20, 50, 40]} autoFit height={200} data={calculateData(clientNow, memos)} >
        <LineAdvance
          shape="smooth"
          point
          area
          position="date*review"
          color="city"
        />
      </Chart>
    </Paper>
  );
}