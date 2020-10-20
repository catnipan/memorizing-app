import React from 'react';
// import { Chart, Interval, Tooltip, Axis } from 'bizcharts';
import { useQuery } from "@apollo/client";
import { ResponsiveBar } from '@nivo/bar'
import { Paper } from '../ui';
import { ClientTimeQuery } from '../query'
import { parseUTC } from '../../clock';

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
      })
    }
    lastToday = today;
    lastMemos = memos;
  }
  return ans;
}

const MyResponsiveBar = ({ data /* see data tab */ }) => (
  <ResponsiveBar
      data={data}
      keys={['review']}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      legends={[
          {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
  />
)

const s = [0,1,2,4,7,15]
export default function Statistics({ memos }) {
  const { data: { clientNow } } = useQuery(ClientTimeQuery);
  const data = calculateData(clientNow, memos);
  return <Paper>
    <div style={{width: '100%', height: '200px'}}>
      <MyResponsiveBar data={data} />
    </div>
    </Paper>
  // return (
  //   <Paper>
  //     <Chart
  //       height={200}
  //       autoFit
  //       data={data}
  //       padding={[30, 30, 30, 50]}
  //     >
  //       <Interval position="date*review" style={['review', (review) => {
  //         const res = { lineWidth:1 };
  //         if(review > 3) res.backgroundColor = "#ff0000";
  //         else res.stroke = "#00ff00";
  //         return res;
  //       }]}/>
  //       <Tooltip shared />
  //     </Chart>
  //   </Paper>
  // );
}