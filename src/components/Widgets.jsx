// All widgets read only from WorldState (plus Config for static links).
import { useState } from "react";
import { NoteComposer } from "./NoteComposer.jsx";

function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function WeatherWidget({ worldState }) {
  const w = worldState.weather;
  if (w.isLoading) {
    return (
      <div className="beach-card p-5">
        <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">Weather</h2>
        <p className="text-sm text-stone-500 mt-2">Checking the sky…</p>
      </div>
    );
  }
  const labels = {
    clear: "Clear skies",
    clouds: "Cloudy",
    fog: "Foggy",
    rain: "Rain",
    snow: "Snow",
    thunderstorm: "Thunderstorms",
  };
  return (
    <div className="beach-card p-5">
      <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">Weather</h2>
      <div className="flex items-end gap-3 mt-2">
        <span className="text-5xl font-extrabold text-stone-800">{w.temperatureF}°</span>
        <span className="text-stone-600 pb-1">{labels[w.condition]}</span>
      </div>
      <p className="text-sm text-stone-500 mt-2">
        H {w.highF}° · L {w.lowF}° · Wind {w.windMph} mph
      </p>
    </div>
  );
}

export function DayCounter({ worldState }) {
  const v = worldState.vacation;
  let big, label;
  if (v.phase === "countdown") {
    big = v.daysUntilStart;
    label = v.daysUntilStart === 1 ? "day until the beach" : "days until the beach";
  } else if (v.phase === "active") {
    big = v.dayNumber;
    label = `of ${v.totalDays} beach days`;
  } else {
    big = "🌊";
    label = "See you next summer";
  }
  return (
    <div className="beach-card p-5 text-center">
      <div className="font-[var(--font-display)] text-6xl text-[var(--color-coral)] leading-none">
        {big}
      </div>
      <p className="text-stone-600 mt-2 font-semibold">{label}</p>
    </div>
  );
}

function dayHeading(d) {
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function EventRow({ e, now, dim }) {
  const past = dim && e.start < now;
  return (
    <li className={`flex gap-3 items-baseline ${past ? "opacity-45" : ""}`}>
      <span className="text-sm font-bold text-[var(--color-coral)] w-20 shrink-0 tabular-nums">
        {fmtTime(e.start)}
      </span>
      <span className={`text-stone-700 ${past ? "line-through" : ""}`}>
        {e.title}
      </span>
    </li>
  );
}

export function Agenda({ worldState, preview, allEvents }) {
  const now = worldState.now;
  const events = worldState.events;
  const [view, setView] = useState("today"); // "today" | "upcoming"

  const showingPreview = events.length === 0 && preview?.events?.length > 0;

  // Group the full calendar by calendar-day for the Upcoming view.
  const upcoming = (allEvents ?? []).filter((e) => {
    const end = e.end ?? e.start;
    return end >= now || e.start.toDateString() === now.toDateString();
  });
  const groups = [];
  for (const e of upcoming) {
    const key = e.start.toDateString();
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(e);
    else groups.push({ key, date: e.start, items: [e] });
  }

  const todayHeading = showingPreview
    ? `Next up — ${dayHeading(preview.date)}`
    : "Today's agenda";

  return (
    <div className="beach-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">
          {view === "today" ? todayHeading : "Upcoming events"}
        </h2>
        <div
          className="inline-flex rounded-full bg-black/5 p-0.5 text-xs font-bold shrink-0"
          role="group"
          aria-label="Agenda view"
        >
          <button
            onClick={() => setView("today")}
            aria-pressed={view === "today"}
            className={`px-3 py-1 rounded-full transition ${
              view === "today"
                ? "bg-white text-[var(--color-coral)] shadow-sm"
                : "text-stone-500"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setView("upcoming")}
            aria-pressed={view === "upcoming"}
            className={`px-3 py-1 rounded-full transition ${
              view === "upcoming"
                ? "bg-white text-[var(--color-coral)] shadow-sm"
                : "text-stone-500"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {view === "today" ? (
        (showingPreview ? preview.events : events).length === 0 ? (
          <p className="text-sm text-stone-500 mt-3">
            Nothing scheduled. A perfect beach day.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {(showingPreview ? preview.events : events).map((e, i) => (
              <EventRow key={i} e={e} now={now} dim={!showingPreview} />
            ))}
          </ul>
        )
      ) : groups.length === 0 ? (
        <p className="text-sm text-stone-500 mt-3">
          No upcoming events on the calendar.
        </p>
      ) : (
        <div className="mt-3 max-h-80 overflow-y-auto pr-1 space-y-4 overscroll-contain">
          {groups.map((g) => (
            <div key={g.key}>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-400 sticky top-0 bg-[var(--color-sandcard)] py-1 backdrop-blur-sm">
                {dayHeading(g.date)}
              </p>
              <ul className="mt-1.5 space-y-2.5">
                {g.items.map((e, i) => (
                  <EventRow key={i} e={e} now={now} dim={false} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Announcements({ worldState, formConfig, onPosted }) {
  const items = worldState.announcements;
  return (
    <div className="beach-card p-5">
      <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">
        House board
      </h2>
      {!items || items.length === 0 ? (
        <p className="text-sm text-stone-500 mt-2">No notes yet today.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((a, i) => (
            <li key={i} className="border-l-4 border-[var(--color-seafoam)] pl-3">
              <p className="text-stone-700">{a.message}</p>
              <p className="text-xs text-stone-500 mt-0.5">
                — {a.name}, {fmtTime(a.postedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <NoteComposer formConfig={formConfig} onPosted={onPosted} />
    </div>
  );
}

export function PhotoLinks({ albums }) {
  return (
    <div className="beach-card p-5">
      <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">Photos</h2>
      <ul className="mt-3 space-y-2">
        {albums.map((a, i) => (
          <li key={i}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--color-coral)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral)] rounded"
            >
              {a.label} →
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-stone-500 mt-3">Drop your shots in the shared album.</p>
    </div>
  );
}


export function UsefulLinks({ links }) {
  return (
    <div className="beach-card p-5">
      <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">
        Useful links
      </h2>
      <ul className="mt-3 space-y-2.5">
        {links.map((l, i) => {
          const pending = l.url.startsWith("REPLACE_ME");
          return (
            <li key={i}>
              {pending ? (
                <span className="text-stone-400 font-semibold">
                  {l.label} <span className="text-xs font-normal">(coming soon)</span>
                </span>
              ) : (
                <a
                  href={l.url}
                  target={l.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--color-coral)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral)] rounded"
                >
                  {l.label} →
                </a>
              )}
              <span className="block text-xs text-stone-500">{l.note}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
