import { useEffect, useState } from 'react';

export default function useCountDown(start) {
  const [curr, update] = useState(start);

  useEffect(() => {
    if (curr > 0) {
      const h = setTimeout(() => update(x => x - 1), 1000);
      return () => clearTimeout(h);
    }
  }, [curr]);

  const reset = () => {
    update(start);
  }
  return [curr, reset];
}