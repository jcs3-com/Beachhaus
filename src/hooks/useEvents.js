import { useEffect, useState } from "react";
import { sampleEvents } from "../data/sampleEvents.js";

// Agenda data. The deploy pipeline bakes events.json into the site
// (GitHub Actions fetches + parses the private ICS feed at build time,
// refreshed by cron). If the file is absent — local dev, or the
// ICS_URL secret not yet configured — fall back to sample data.
export function useEvents() {
  const [events, setEvents] = useState(sampleEvents);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}events.json`, {
          cache: "no-cache",
        });
        if (!res.ok) return; // keep sample fallback
        const data = await res.json();
        if (cancelled || !Array.isArray(data.events)) return;
        const today = new Date();
        const parsed = data.events
          .map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
          .filter((e) => e.start.toDateString() === today.toDateString());
        setEvents(parsed);
      } catch {
        // network/parse failure: keep whatever we have
      }
    }

    load();
    const id = setInterval(load, 15 * 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return events;
}
