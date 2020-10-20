import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import gql from 'graphql-tag';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import client from './graphql-client';

// dayjs set up
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration)
dayjs.extend(relativeTime)

// constant
const FORMAT = "YYYY-MM-DD HH:mm:ss";
const clientTimezone = dayjs.tz.guess();
const GetClientTimeQuery = gql`
  query GetClientTimeQuery {
    clientNow @client
  }
`;

export const parseUTC = ts => dayjs(ts, FORMAT).utc(true);
export const formatLocal = time => time.tz(clientTimezone).format(FORMAT);

export const humanizeDuration = duration => dayjs.duration(duration).humanize();

const updateClientTime = t => {
  client.writeQuery({
    query: GetClientTimeQuery,
    data: {
      clientNow: t,
    }
  })
}

const runClock = () => {
  setInterval(() => {
    const { clientNow } = client.readQuery({
      query: GetClientTimeQuery,
    });
    client.writeQuery({
      query: GetClientTimeQuery,
      data: {
        clientNow: clientNow.add(1, 's'),
      }
    })
  }, 1000);
}

export const initClientTime = () => {
  updateClientTime(dayjs());
  runClock();
}

export const syncClientTime = serverTimeStr => {
  client.writeQuery({
    query: GetClientTimeQuery,
    data: {
      clientNow: parseUTC(serverTimeStr),
    }
  })
}
