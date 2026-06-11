import { Config } from "./config.js";
import { deriveWorldState } from "./state/worldState.js";
import { useClock } from "./hooks/useClock.js";
import { useWeather } from "./hooks/useWeather.js";
import { useAnnouncements } from "./hooks/useAnnouncements.js";
import { useEvents } from "./hooks/useEvents.js";
import { Poll } from "./components/Poll.jsx";
import { SkyBackdrop } from "./components/SkyBackdrop.jsx";
import { HouseLayer } from "./components/HouseLayer.jsx";
import {
  WeatherWidget,
  DayCounter,
  Agenda,
  Announcements,
  PhotoLinks,
  UsefulLinks,
} from "./components/Widgets.jsx";

export default function App() {
  const now = useClock();
  const { raw: rawWeather } = useWeather(Config);
  const { items: announcements, addLocal, votes } = useAnnouncements(Config);
  const { events, preview } = useEvents();

  // Single derivation point: everything below renders from WorldState.
  const worldState = deriveWorldState({
    config: Config,
    now,
    rawWeather,
    events, // live ICS data via build pipeline; sample fallback inside the hook
    announcements,
  });

  const dateLine = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <SkyBackdrop worldState={worldState} />
      <HouseLayer worldState={worldState} />
      <main className="min-h-screen px-4 py-8 sm:px-8 max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1
            className="text-5xl sm:text-6xl text-white drop-shadow-[0_3px_8px_rgba(20,40,70,0.45)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {Config.house.name}
          </h1>
          <p className="text-white/90 font-semibold mt-1 drop-shadow">
            {Config.house.tagline} · {dateLine}
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DayCounter worldState={worldState} />
          <WeatherWidget worldState={worldState} />
          <PhotoLinks albums={Config.photoAlbums} />
          <div className="sm:col-span-2">
            <Agenda worldState={worldState} preview={preview} />
          </div>
          <Announcements
            worldState={worldState}
            formConfig={Config.announcements.form}
            onPosted={addLocal}
          />
          <div className="sm:col-span-2">
            <Poll
              pollConfig={Config.poll}
              formConfig={Config.announcements.form}
              votes={votes}
              onVoted={() => {}}
            />
          </div>
          <UsefulLinks links={Config.usefulLinks} />
        </div>
      </main>
    </>
  );
}
