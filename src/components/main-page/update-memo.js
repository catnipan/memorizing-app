import client from '../../graphql-client';
import { GetAllMemoQuery } from '../query';

export default function updateMemo(updator) {
  const { memos } = client.readQuery({ query: GetAllMemoQuery });
  var sortedMemos = [...updator(memos)];
  sortedMemos.sort((a, b) => {
    if (a.Schedule == b.Schedule) return 0;
    if (a.Schedule < b.Schedule) return -1;
    return 1;
  })
  client.writeQuery({
    query: GetAllMemoQuery,
    data: {
      memos: sortedMemos,
    }
  });
}