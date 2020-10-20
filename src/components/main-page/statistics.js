import React from 'react';
import { Paper } from '../ui';
import { Chart, LineAdvance } from 'bizcharts';
import { parseUTC } from '../../clock';

const data = [
	{
		month: "Jan",
		city: "Tokyo",
		temperature: 7
	},
	{
		month: "Feb",
		city: "Tokyo",
		temperature: 13
	},
	{
		month: "Mar",
		city: "Tokyo",
		temperature: 16.5
	},
	{
		month: "Apr",
		city: "Tokyo",
		temperature: 14.5
	},
	{
		month: "May",
		city: "Tokyo",
		temperature: 10
	},
	{
		month: "Jun",
		city: "Tokyo",
		temperature: 7.5
	},
	{
		month: "Jul",
		city: "Tokyo",
		temperature: 9.2
	},
	{
		month: "Aug",
		city: "Tokyo",
		temperature: 14.5
	},
	{
		month: "Sep",
		city: "Tokyo",
		temperature: 9.3
	},
	{
		month: "Oct",
		city: "Tokyo",
		temperature: 8.3
	},
	{
		month: "Nov",
		city: "Tokyo",
		temperature: 8.9
	},
	{
		month: "Dec",
		city: "Tokyo",
		temperature: 5.6
	},
];

const s = [0,1,2,4,7,15]
export default function Statistics({ memos }) {
  const dateCount = {};
  memos.forEach(({ Stage, Schedule }) => {
    const day = parseUTC(Schedule);
    for (let i = Stage; i < s.length; ++i) {
      const date = day.add(i == Stage ? 0 : s[i] - s[i - 1], 'day').format("YYYY-MM-DD");
      dateCount[date] = (dateCount[date] || 0) + 1;
    }
  });
  const data = [];
  for (const [date, count] of Object.entries(dateCount)) {
    data.push({
      date,
      count,
      city: 'review work load schedule'
    })
  }
  return (
    <Paper>
      <Chart padding={[10, 20, 50, 40]} autoFit height={200} data={data} >
        <LineAdvance
          shape="smooth"
          point
          area
          position="date*count"
          color="city"
        />
      </Chart>
    </Paper>
  );
}