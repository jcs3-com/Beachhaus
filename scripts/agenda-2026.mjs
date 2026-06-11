// =============================================================
// BeachHaus vacation agenda — July 11–18, 2026 (all times ET).
// Single source of truth:
//  - `node scripts/agenda-2026.mjs` regenerates public/events.json
//  - the same list replays into the BeachHaus Google Calendar
// Once a live ICS_URL secret exists, the CI fetch script overwrites
// events.json at build time and this file becomes the archive.
//
// Research notes (verified June 2026):
//  - Bandstand: concerts Thu + Sat 7:30pm; Kids Nights Wednesdays in
//    July 6pm; Movies on the Bandstand Mondays at dusk
//  - Farmers market: Sundays, downtown (across from PNC)
//  - "Boardwalk fries" in Bethany = D B Fries, 100 Garfield Pkwy
//    (Thrasher's is Rehoboth)
//  - Nature Center open Wed–Fri 10–3, Sat 10–12
// =============================================================

const TZ = "-04:00"; // EDT in July

function ev(day, startHM, endHM, title, opts = {}) {
  return {
    title,
    start: `2026-07-${String(day).padStart(2, "0")}T${startHM}:00${TZ}`,
    end: `2026-07-${String(day).padStart(2, "0")}T${endHM}:00${TZ}`,
    allDay: false,
    ...opts,
  };
}

export const agenda2026 = [
  // ---- Daily rhythm (Jul 12–17) ----
  ...[12, 13, 14, 15, 16, 17].map((d) =>
    ev(d, "07:30", "08:00", "Early kids breakfast", {
      description: "Wake-up 7:00. Kids eat first; everyone else grazes after.",
    })
  ),
  ...[12, 13, 14, 15, 16, 17].map((d) =>
    ev(d, "14:00", "16:30", "Pool time (Sea Colony passes)", {
      description: "Afternoon pool block. Passes in the kitchen drawer.",
    })
  ),
  ...[11, 12, 13, 14, 15, 16, 17].map((d) =>
    ev(d, "21:00", "23:00", "Feierabend", {
      description:
        "Kids are down — adult free time. Porch, cards, wine. (German: the easy evening after the work is done.)",
    })
  ),

  // ---- Saturday Jul 11 — arrival ----
  ev(11, "16:00", "17:30", "Check-in & unpack"),
  ev(11, "19:00", "20:45", "Boardwalk stroll + ice cream (concert 7:30)", {
    description:
      "First night on the boardwalk. Ice cream at Maureen's (99 Garfield Pkwy). Saturday Bandstand concert starts 7:30 — free, bring chairs.",
    location: "Bethany Beach Boardwalk",
  }),

  // ---- Sunday Jul 12 ----
  ev(12, "08:30", "09:30", "Bethany Farmers Market", {
    description: "Downtown, across from PNC Bank. Sundays all summer.",
  }),
  ev(12, "09:45", "12:30", "Beach morning"),
  ev(12, "16:45", "17:15", "Ice cream run — By The Bay Creamery", {
    location: "26 N Pennsylvania Ave, Bethany Beach",
  }),
  ev(12, "20:00", "20:45", "Firefly walk", {
    description: "Dusk walk — bring the jars, release before bed.",
  }),

  // ---- Monday Jul 13 ----
  ev(13, "09:00", "12:00", "Beach morning"),
  ev(13, "12:15", "13:15", "Boardwalk fries — D B Fries", {
    description:
      "Bethany's boardwalk fries (100 Garfield Pkwy, right at the boardwalk). Malt vinegar mandatory.",
    location: "100 Garfield Pkwy, Bethany Beach",
  }),
  ev(13, "20:30", "22:00", "Movie on the Bandstand (dusk)", {
    description: "Monday movie night on the boardwalk. Blankets + chairs.",
  }),

  // ---- Tuesday Jul 14 ----
  ev(14, "09:00", "12:00", "Beach morning"),
  ev(14, "16:45", "18:00", "Bike ride + ice cream at Ba Roos", {
    description: "Easy ~1 mile ride. Smoothie bowls for the healthy, ice cream for the honest.",
    location: "33550 Market Pl, Bethany Beach",
  }),
  ev(14, "20:00", "20:45", "Firefly walk #2"),

  // ---- Wednesday Jul 15 ----
  ev(15, "10:00", "11:30", "Bethany Beach Nature Center", {
    description:
      "Marsh boardwalk trail, osprey nests, playground. Free. Open Wed 10–3.",
    location: "807 Garfield Pkwy, Bethany Beach",
  }),
  ev(15, "18:00", "19:30", "Kids Night at the Bandstand", {
    description: "July Wednesdays, 6pm start. Family entertainment, free.",
  }),

  // ---- Thursday Jul 16 ----
  ev(16, "08:15", "09:15", "Tennis + fitness center (Sea Colony passes)"),
  ev(16, "09:30", "12:15", "Beach late morning"),
  ev(16, "17:30", "19:15", "Family dinner out", {
    description: "The one big dinner out — pick a spot and reserve early in the week.",
  }),
  ev(16, "19:30", "21:00", "Seaside Concert at the Bandstand", {
    description: "Thursday summer concert, 7:30. Free, limited bench seating — bring chairs.",
  }),

  // ---- Friday Jul 17 ----
  ev(17, "09:00", "12:00", "Beach morning — last full beach day"),
  ev(17, "18:30", "19:45", "Mini golf — Pirate Golf", {
    description: "In town, walkable from the boardwalk. Loser buys ice cream.",
    location: "21 N Pennsylvania Ave, Bethany Beach",
  }),
  ev(17, "19:45", "20:15", "Sunset ice cream — By The Bay Creamery"),

  // ---- Saturday Jul 18 — departure ----
  ev(18, "07:30", "08:15", "One last beach walk"),
  ev(18, "08:30", "10:00", "Pack up & check out"),
];

// ---- regenerate public/events.json ----
if (process.argv[1] && process.argv[1].endsWith("agenda-2026.mjs")) {
  const { writeFileSync, mkdirSync } = await import("node:fs");
  mkdirSync("public", { recursive: true });
  const events = agenda2026
    .map(({ title, start, end, allDay }) => ({
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      allDay,
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  writeFileSync(
    "public/events.json",
    JSON.stringify({ generatedAt: new Date().toISOString(), source: "static-agenda-2026", events }, null, 2)
  );
  console.log(`Wrote ${events.length} events`);
}
