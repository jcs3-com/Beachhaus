import { useEffect, useState } from "react";

// Ticks once per minute, aligned to the minute boundary, so timeOfDay
// transitions land on time rather than up to 59s late.
export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let interval;
    const msToNextMinute = 60000 - (Date.now() % 60000);
    const align = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60000);
    }, msToNextMinute);
    return () => {
      clearTimeout(align);
      if (interval) clearInterval(interval);
    };
  }, []);

  return now;
}
