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
    // Inline composer posts here (Google Forms formResponse endpoint).
    // entryName/entryNote are the form's internal field IDs — found via
    // the form's "Get pre-filled link". Until set, the Post button
    // falls back to opening the form in a new tab.
    form: {
      actionUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSf7bPW28vXWj5uhBuZdCvstQ7Q3TbAxHOBl6YD40CeHx4tZtg/formResponse",
      viewUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSf7bPW28vXWj5uhBuZdCvstQ7Q3TbAxHOBl6YD40CeHx4tZtg/viewform",
      entryName: "",
      entryNote: "",
    },
    csvUrl:
      "https://docs.google.com/spreadsheets/d/1eDVRMXQydFSojtzRThui04gkd0yHuM3CZse2P_el09c/gviz/tq?tqx=out:csv&sheet=Form%20Responses%201",
    // Default expiry policy: next local midnight after posting.
    defaultExpiry: "next-local-midnight",
  },

  // Static shared-album links (no Photos API in v1).
  photoAlbums: [
    {
      label: "Beach Week 2026 — shared album",
      url: "https://photos.app.goo.gl/YMwAqKzJbna5cHpMA",
    },
  ],

  // Useful links card. VRBO URL still needed from James.
  usefulLinks: [
    {
      label: "Order groceries (Instacart)",
      url: "https://www.instacart.com",
      note: "Delivery to the house",
    },
    {
      label: "Morning coffee — Clove & Cedar",
      url: "https://maps.google.com/?q=Clove+%26+Cedar+Coffeebar+Bethany+Beach",
      note: "759 Garfield Pkwy · opens 7:30am",
    },
    {
      label: "Beach forecast (NWS)",
      url: "https://forecast.weather.gov/MapClick.php?lat=38.5393&lon=-75.0552",
      note: "Official point forecast",
    },
    {
      label: "Bandstand events",
      url: "https://www.townofbethanybeach.com/261/Bandstand",
      note: "Free concerts, movies, kids nights",
    },
    {
      label: "Our VRBO listing",
      url: "REPLACE_ME_VRBO_URL",
      note: "Rental details",
    },
    {
      label: "House info one-pager",
      url: "house-info.html",
      note: "Codes, tips, checkout list (printable)",
    },
  ],

  // Pre-vacation poll. Votes post through the announcements form
  // as structured notes ("#vote: a|b|c") and tally from the same CSV.
  poll: {
    question: "What are you most looking forward to?",
    options: [
      "Beach days",
      "Pool time",
      "Getting ice cream",
      "Boardwalk fries",
      "Mini golf",
      "Bandstand concerts",
      "Boardwalk movie night",
      "Firefly walks",
      "Bike rides",
      "Tennis & fitness center",
      "Farmers market",
      "Fishing",
      "Kayaking",
      "Shopping in town",
      "Dinner out",
      "Nature Center & osprey trail",
    ],
  },
};
