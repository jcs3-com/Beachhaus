// =============================================================
// Config — static inputs only. Nothing in here is derived.
// All derived render-state lives in WorldState (src/state/worldState.js).
// Widgets and the SkyBackdrop must never read Config directly for
// anything that WorldState already expresses.
// =============================================================

export const Config = {
  house: {
    name: "Beachhaus",
    tagline: "Bethany Beach, Delaware",
  },

  // Bethany Beach, DE
  location: {
    latitude: 38.5393,
    longitude: -75.0552,
    timezone: "America/New_York",
  },

  // Vacation window for the day counter.
  // Update these per stay. ISO dates, local to `location.timezone`.
  vacation: {
    startDate: "2026-07-11",
    endDate: "2026-07-18",
  },

  // Clock-based timeOfDay boundaries (24h, local). Phase 2 replaces
  // these with solar-anchored times from Open-Meteo sunrise/sunset.
  timeOfDayBoundaries: {
    dawn: 5, // 05:00–06:59
    morning: 7, // 07:00–10:59
    midday: 11, // 11:00–13:59
    afternoon: 14, // 14:00–16:59
    dusk: 17, // 17:00–19:59
    night: 20, // 20:00–04:59
  },

  weather: {
    // Open-Meteo: keyless, no OAuth. weather_code is the WMO field.
    refreshMinutes: 15,
  },

  // v1 agenda: server-side ICS parsing is the plan of record. Until
  // that endpoint exists, leave icsProxyUrl empty and the agenda
  // renders sample data from src/data/sampleEvents.js.
  calendar: {
    icsProxyUrl: "",
  },

  // v1 announcements: Google Form -> Google Sheet -> published CSV.
  // Publish the sheet to the web as CSV and paste the URL here.
  // Empty string renders sample announcements.
  announcements: {
    csvUrl: "",
    // Default expiry policy: next local midnight after posting.
    defaultExpiry: "next-local-midnight",
  },

  // Static shared-album links (no Photos API in v1).
  photoAlbums: [
    {
      label: "Beach Week 2026",
      url: "https://photos.app.goo.gl/REPLACE_ME",
    },
  ],
};
