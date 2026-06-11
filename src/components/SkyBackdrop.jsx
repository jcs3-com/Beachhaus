// =============================================================
// SkyBackdrop — the rearmost layer of the eventual house diorama.
// Reads ONLY from WorldState: { timeOfDay, weather.condition }.
// Permanent architecture: when the animated house facade arrives,
// it layers in front of this component untouched.
// =============================================================

const SKY_GRADIENTS = {
  dawn: ["#2b2d5e", "#b06a8f", "#f4a988", "#ffd9a0"],
  morning: ["#7ec8e3", "#a8ddf0", "#d9f1fa", "#fdf6e3"],
  midday: ["#2e8bc0", "#61b8e8", "#a5dcf5", "#e8f7fd"],
  afternoon: ["#3a9ad9", "#7cc4ec", "#c2e6f7", "#fff3d6"],
  dusk: ["#3b2a5a", "#8d4a7c", "#e8744f", "#ffc46b"],
  night: ["#0a0e2a", "#141a45", "#1f2a5e", "#2c3a70"],
};

// Per-condition overlay tints, layered over the timeOfDay gradient.
const CONDITION_OVERLAYS = {
  clear: "transparent",
  clouds: "rgba(140, 152, 168, 0.30)",
  fog: "rgba(205, 212, 218, 0.55)",
  rain: "rgba(75, 88, 110, 0.40)",
  snow: "rgba(190, 200, 215, 0.30)",
  thunderstorm: "rgba(35, 40, 60, 0.55)",
};

function gradientCss(stops) {
  return `linear-gradient(to bottom, ${stops
    .map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`)
    .join(", ")})`;
}

function Stars() {
  // Deterministic pseudo-random star field — stable across renders.
  const stars = Array.from({ length: 70 }, (_, i) => {
    const seed = Math.sin(i * 999) * 10000;
    const r = (n) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };
    return {
      left: `${r(1) * 100}%`,
      top: `${r(2) * 60}%`,
      size: r(3) > 0.85 ? 2.5 : 1.5,
      delay: `${r(4) * 4}s`,
    };
  });
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="sky-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

function Clouds({ heavy }) {
  const blobs = heavy
    ? [
        { top: "8%", scale: 1.4, duration: "85s", delay: "-20s", opacity: 0.9 },
        { top: "22%", scale: 1.0, duration: "65s", delay: "-50s", opacity: 0.8 },
        { top: "15%", scale: 1.8, duration: "110s", delay: "-5s", opacity: 0.85 },
        { top: "32%", scale: 0.8, duration: "55s", delay: "-30s", opacity: 0.7 },
      ]
    : [
        { top: "12%", scale: 1.1, duration: "95s", delay: "-40s", opacity: 0.7 },
        { top: "26%", scale: 0.7, duration: "70s", delay: "-10s", opacity: 0.55 },
      ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="sky-cloud"
          style={{
            top: b.top,
            opacity: b.opacity,
            transform: `scale(${b.scale})`,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}

function Rain() {
  const drops = Array.from({ length: 60 }, (_, i) => ({
    left: `${(i * 1.7 + (i % 7) * 0.4) % 100}%`,
    delay: `${(i % 12) * 0.11}s`,
    duration: `${0.6 + (i % 5) * 0.08}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((d, i) => (
        <span
          key={i}
          className="sky-raindrop"
          style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }}
        />
      ))}
    </div>
  );
}

function Snow() {
  const flakes = Array.from({ length: 40 }, (_, i) => ({
    left: `${(i * 2.6 + (i % 5)) % 100}%`,
    delay: `${(i % 10) * 0.5}s`,
    duration: `${6 + (i % 6)}s`,
    size: 3 + (i % 3),
  }));
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="sky-snowflake"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
        />
      ))}
    </div>
  );
}

function SunOrMoon({ timeOfDay }) {
  if (timeOfDay === "night") {
    return <div className="sky-moon" aria-hidden="true" />;
  }
  const positions = {
    dawn: { left: "12%", top: "55%" },
    morning: { left: "28%", top: "28%" },
    midday: { left: "50%", top: "12%" },
    afternoon: { left: "68%", top: "24%" },
    dusk: { left: "85%", top: "52%" },
  };
  const pos = positions[timeOfDay] ?? positions.midday;
  return <div className="sky-sun" style={pos} aria-hidden="true" />;
}

export function SkyBackdrop({ worldState }) {
  const { timeOfDay, weather } = worldState;
  const condition = weather.condition;
  const showCelestial = condition === "clear" || condition === "clouds";

  return (
    <div
      className="fixed inset-0 -z-10 transition-[background] duration-[3000ms]"
      style={{ background: gradientCss(SKY_GRADIENTS[timeOfDay]) }}
    >
      {timeOfDay === "night" && condition === "clear" && <Stars />}
      {showCelestial && <SunOrMoon timeOfDay={timeOfDay} />}
      {(condition === "clouds" ||
        condition === "rain" ||
        condition === "thunderstorm") && (
        <Clouds heavy={condition !== "clouds"} />
      )}
      {(condition === "rain" || condition === "thunderstorm") && <Rain />}
      {condition === "snow" && <Snow />}
      {condition === "thunderstorm" && (
        <div className="sky-lightning absolute inset-0" aria-hidden="true" />
      )}
      <div
        className="absolute inset-0 transition-[background-color] duration-[3000ms]"
        style={{ backgroundColor: CONDITION_OVERLAYS[condition] }}
      />
    </div>
  );
}
