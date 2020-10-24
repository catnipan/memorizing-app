import { useQuery } from '@apollo/client';
import { parseUTC, humanizeDuration, formatLocal } from '../../clock';
import { ClientTimeQuery } from '../query';

export const Status = {
  Expired: Symbol.for('Expired'),
  JustNow: Symbol.for('JustNow'),
  NotYet: Symbol.for('NotYet'),
}

export default function useStatus(scheduleStr) {
  const schedule = parseUTC(scheduleStr);
  const { data: { clientNow } } = useQuery(ClientTimeQuery);
  // ~       [schedule, schedule + 1 day]   ~
  // NotYet         JustNow               Expired
  const diff = schedule.diff(clientNow)
  if (diff > 0) {
    return {
      type: Status.NotYet,
      comment: `Come back in ${humanizeDuration(diff)} to continue Memorizing.`
    }
  } else {
    const deadline = schedule.add(1, 'day');
    const diff = deadline.diff(clientNow);
    if (diff < 0) {
      return {
        type: Status.Expired,
        comment: `This Memo card expired ${humanizeDuration(diff)} ago.`
      }
    } else {
      return {
        type: Status.JustNow,
        comment: `Time left to review: ${humanizeDuration(diff)}`,
      }
    }
  }
}