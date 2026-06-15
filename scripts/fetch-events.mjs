// =============================================================
// Build-time ICS -> events.json
// Runs in GitHub Actions (the "server" for this static site).
// Reads the private Google Calendar ICS URL from the ICS_URL env
// (repo Actions secret) so it never reaches the browser.
//
// Output: public/events.json — events in a [today, +7 days] window,
// recurring events expanded. Vite copies it into dist/ at build.
// If ICS_URL is unset, exits cleanly and the client falls back to
// sample data.
//
// Note: the workflow sets TZ=America/New_York so wall-clock times in
// the family calendar expand correctly even though CI runs in UTC.
// =============================================================

import ical from "node-ical";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { Config } from "../src/config.js";

const WINDOW_DAYS = 7;

// Window: from start-of-today through the end of the vacation (+1 day),
// but never shorter than WINDOW_DAYS. This keeps "Today's agenda" honest
// (only genuinely today's items) while guaranteeing the full Beachhaus
// trip is baked in for the Upcoming view, even when the trip is months out.
function windowEndFor(now) {
  const minEnd = new Date(now.getTime() + WINDOW_DAYS * 86400000);
  const vacEnd = new Date(Config.vacation.endDate + "T23:59:59");
  const vacEndPad = new Date(vacEnd.getTime() + 86400000);
  return vacEndPad > minEnd ? vacEndPad : minEnd;
}

export function eventsFromIcs(icsText, now = new Date()) {
  const parsed = ical.sync.parseICS(icsText);
  const windowStart = new Date(now);
  windowStart.setHours(0, 0, 0, 0);
  const windowEnd = windowEndFor(windowStart);

  const out = [];

  for (const ev of Object.values(parsed)) {
    if (ev.type !== "VEVENT") continue;
    const allDay = ev.datetype === "date";
    const durationMs =
      ev.end && ev.start ? ev.end.getTime() - ev.start.getTime() : 0;

    if (ev.rrule) {
      // Expand recurrences inside the window; honor EXDATEs and
      // per-instance overrides (RECURRENCE-ID).
      const exdates = new Set(
        Object.values(ev.exdate ?? {}).map((d) => new Date(d).toDateString() + new Date(d).getTime())
      );
      const overrides = ev.recurrences ?? {};
      const dates = ev.rrule.between(windowStart, windowEnd, true);

      for (const date of dates) {
        const key = date.toDateString() + date.getTime();
        if (exdates.has(key)) continue;
        const ovKey = date.toISOString().slice(0, 10);
        const ov = overrides[ovKey];
        const start = ov?.start ?? date;
        out.push({
          title: (ov?.summary ?? ev.summary) || "(untitled)",
          start: new Date(start).toISOString(),
          end: new Date(new Date(start).getTime() + durationMs).toISOString(),
          allDay,
        });
      }
    } else if (ev.start && ev.start >= windowStart && ev.start < windowEnd) {
      out.push({
        title: ev.summary || "(untitled)",
        start: ev.start.toISOString(),
        end: ev.end ? ev.end.toISOString() : ev.start.toISOString(),
        allDay,
      });
    }
  }

  out.sort((a, b) => new Date(a.start) - new Date(b.start));
  return out.slice(0, 100);
}

// ---- main (skipped when imported for tests) ----
if (process.argv[1] && process.argv[1].endsWith("fetch-events.mjs")) {
  const url = process.env.ICS_URL;
  if (!url) {
    console.log("ICS_URL not set — skipping; client will use sample agenda.");
    process.exit(0);
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`ICS fetch failed: ${res.status}`);
    process.exit(1);
  }
  const events = eventsFromIcs(await res.text());
  // Don't blank a known-good calendar: if this run found nothing in the
  // window, keep whatever events.json already exists rather than shipping
  // an empty agenda.
  if (events.length === 0 && existsSync("public/events.json")) {
    const prev = JSON.parse(readFileSync("public/events.json", "utf8"));
    const prevCount = Array.isArray(prev.events) ? prev.events.length : 0;
    if (prevCount > 0) {
      console.warn(
        `ICS returned 0 events in window — preserving existing events.json (${prevCount} events).`
      );
      process.exit(0);
    }
  }
  mkdirSync("public", { recursive: true });
  writeFileSync(
    "public/events.json",
    JSON.stringify({ generatedAt: new Date().toISOString(), events }, null, 2)
  );
  console.log(`Wrote ${events.length} events to public/events.json`);
}
