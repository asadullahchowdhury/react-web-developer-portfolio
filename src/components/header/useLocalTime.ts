import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dhaka',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const now = () => formatter.format(new Date());

/** Jashore local time, "HH:MM" (Asia/Dhaka), updated on each minute boundary. */
export function useLocalTime(): string {
  const [time, setTime] = useState(now);

  useEffect(() => {
    let interval: number | undefined;
    const tick = () => setTime(now());
    // Align to the next minute, then tick every minute
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000) + 50);
    return () => {
      window.clearTimeout(timeout);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, []);

  return time;
}
