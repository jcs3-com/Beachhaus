// =============================================================
// BeachHaus vacation agenda — August 8–15, 2026 (all times ET).
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
    start: `2026-08-${String(day).padStart(2, "0")}T${startHM}:00${TZ}`,
    end: `2026-08-${String(day).padStart(2, "0")}T${endHM}:00${TZ}`,
    allDay: false,
    ...opts,
  };
}

export const agenda2026 = [
  // ---- Daily rhythm (Aug 9–14) ----
  ...[9, 10, 11, 12, 13, 14].map((d) =>
    ev(d, "07:30", "08:00", "Early kids breakfast", {
      description: "Wake-up 7:00. Kids eat first; everyone else grazes after.",
    })
  ),
  ...[9, 10, 11, 12, 13, 14].map((d) =>
    ev(d, "14:00", "16:30", "Pool time (Bethany West)", {
      description: "Afternoon pool block at the Bethany West community pool. Passes in the kitchen drawer.",
    })
  ),
  ...[8, 9, 10, 11, 12, 13, 14].map((d) =>
    ev(d, "21:00", "23:00", "Feierabend", {
      description:
        "Kids are down — adult free time. Porch, cards, wine. (German: the easy evening after the work is done.)",
    })
  ),

  // ---- Saturday Aug 8 — arrival ----
  ev(8, "15:00", "17:00", "Check-in & unpack (check-in 3pm)"),
  ev(8, "19:00", "20:45", "Boardwalk stroll + ice cream (concert 7:30)", {
    description:
      "First night on the boardwalk. Ice cream at Maureen's (99 Garfield Pkwy). Saturday Bandstand concert 7:30 — The Rock Orchestra (Jimmy Buffett tribute). Free, bring chairs.",
    location: "Bethany Beach Boardwalk",
  }),

  // ---- Sunday Aug 9 ----
  ev(9, "08:30", "09:30", "Bethany Farmers Market", {
    description: "Downtown, across from PNC Bank. Sundays all summer.",
  }),
  ev(9, "09:45", "12:30", "Beach morning"),
  ev(9, "16:45", "17:15", "Ice cream run — By The Bay Creamery", {
    location: "26 N Pennsylvania Ave, Bethany Beach",
  }),
  ev(9, "20:00", "20:45", "Firefly walk", {
    description: "Dusk walk — bring the jars, release before bed.",
  }),

  // ---- Monday Aug 10 ----
  ev(10, "09:00", "12:00", "Beach morning"),
  ev(10, "12:15", "13:15", "Boardwalk fries — D B Fries", {
    description:
      "Bethany's boardwalk fries (100 Garfield Pkwy, right at the boardwalk). Malt vinegar mandatory.",
    location: "100 Garfield Pkwy, Bethany Beach",
  }),
  ev(10, "20:30", "22:00", "Movie on the Bandstand (dusk)", {
    description: "Monday movie night on the boardwalk. Blankets + chairs.",
  }),

  // ---- Tuesday Aug 11 ----
  ev(11, "09:00", "12:00", "Beach morning"),
  ev(11, "16:45", "18:00", "Bike ride + ice cream at Ba Roos", {
    description: "Easy ~1 mile ride. Smoothie bowls for the healthy, ice cream for the honest.",
    location: "33550 Market Pl, Bethany Beach",
  }),
  ev(11, "20:00", "20:45", "Firefly walk #2"),

  // ---- Wednesday Aug 12 ----
  ev(12, "10:00", "11:30", "Bethany Beach Nature Center", {
    description:
      "Marsh boardwalk trail, osprey nests, playground. Free. Open Wed 10–3.",
    location: "807 Garfield Pkwy, Bethany Beach",
  }),
  ev(12, "18:00", "19:30", "Arcade night — Shore Fun Family Fun Center", {
    description:
      "Kids Nights at the Bandstand are July-only, so arcade night instead — claw machines, ticket games, prizes.",
    location: "108 Garfield Pkwy, Bethany Beach",
  }),

  // ---- Thursday Aug 13 ----
  ev(13, "08:15", "09:15", "Tennis or pickleball hour (Bethany West)", {
    description: "Bethany West: 8 tennis courts + pickleball at the clubhouse on Half Moon Circle.",
  }),
  ev(13, "09:30", "12:15", "Beach late morning"),
  ev(13, "17:30", "19:15", "Family dinner out", {
    description: "The one big dinner out. Walkable owner favorites: DiFebo's (Italian), Off the Hook (769 Garfield), CocoLo Sushi (776 Garfield). Reserve early in the week.",
  }),
  ev(13, "19:30", "21:00", "Seaside Concert at the Bandstand", {
    description: "Thursday summer concert, 7:30 — US Army Field Band (pop). Free, limited bench seating — bring chairs.",
  }),

  // ---- Friday Aug 14 ----
  ev(14, "09:00", "12:00", "Beach morning — last full beach day"),
  ev(14, "18:30", "19:45", "Mini golf — Pirate Golf", {
    description: "In town, walkable from the boardwalk. Loser buys ice cream.",
    location: "21 N Pennsylvania Ave, Bethany Beach",
  }),
  ev(14, "19:45", "20:15", "Sunset ice cream — By The Bay Creamery"),

  // ---- Saturday Aug 15 — departure ----
  ev(15, "07:30", "08:15", "One last beach walk"),
  ev(15, "08:30", "10:00", "Pack up & check out"),
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
