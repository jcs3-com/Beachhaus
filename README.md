# Beachhaus — Home Page

A shared family dashboard for the beach house in Bethany Beach, Delaware.
Daily agenda, weather, vacation day counter, house announcements board,
and shared photo album links — all floating over a sky that reacts to
the real time of day and real weather.

## Quick start

```bash
npm install
npm run dev
```

## Architecture

The core pattern is a strict split between **`Config`** (static inputs,
`src/config.js`) and **`WorldState`** (derived render-state,
`src/state/worldState.js`). Every widget and the `SkyBackdrop` read only
from `WorldState`. `App.jsx` is the single derivation point.

### Locked enums

| Field | Values |
|---|---|
| `weather.condition` | `clear` \| `clouds` \| `fog` \| `rain` \| `snow` \| `thunderstorm` |
| `timeOfDay` | `dawn` \| `morning` \| `midday` \| `afternoon` \| `dusk` \| `night` |

`timeOfDay` is clock-based in Phase 1 (boundaries in `Config`).
WMO `weather_code` values from Open-Meteo map onto the 6-state
condition enum in `conditionFromWmoCode()`.

### Sky backdrop

`src/components/SkyBackdrop.jsx` is permanent architecture: it is the
rearmost layer of the eventual animated house diorama. Gradients keyed
by `timeOfDay`, condition overlays and particle layers (drifting clouds,
rain, snow, stars, lightning) keyed by `weather.condition`. Respects
`prefers-reduced-motion`.

## Data sources

| Feature | Source | Status |
|---|---|---|
| Weather | Open-Meteo (keyless, WMO `weather_code`) | Live |
| Agenda | Google Calendar ICS feed via server-side proxy | Sample data until proxy exists (`Config.calendar.icsProxyUrl`) |
| Announcements | Google Form → Sheet → published CSV | Sample data until CSV URL set (`Config.announcements.csvUrl`) |
| Photos | Static shared-album links | Configure in `Config.photoAlbums` |

Announcements expire at the next local midnight after posting —
family notes are ephemeral by default.

## Roadmap

- **Phase 2** — Solar-anchored `timeOfDay` using Open-Meteo
  `sunrise`/`sunset` instead of clock boundaries.
- **Later** — Animated cartoon house facade diorama, layered in front
  of the existing sky backdrop. The sky is built to receive it.
