// All widgets read only from WorldState (plus Config for static links).

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

export function Agenda({ worldState }) {
  const now = worldState.now;
  const events = worldState.events;
  return (
    <div className="beach-card p-5">
      <h2 className="font-[var(--font-display)] text-lg text-[var(--color-driftwood)]">
        Today's agenda
      </h2>
      {events.length === 0 ? (
        <p className="text-sm text-stone-500 mt-2">
          Nothing scheduled. A perfect beach day.
        </p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {events.map((e, i) => {
            const past = e.start < now;
            return (
              <li key={i} className={`flex gap-3 items-baseline ${past ? "opacity-45" : ""}`}>
                <span className="text-sm font-bold text-[var(--color-coral)] w-20 shrink-0 tabular-nums">
                  {fmtTime(e.start)}
                </span>
                <span className={`text-stone-700 ${past ? "line-through" : ""}`}>{e.title}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Announcements({ worldState }) {
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
