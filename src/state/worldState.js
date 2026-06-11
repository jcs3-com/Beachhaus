// =============================================================
// WorldState — derived render-state.
// Pure functions: (Config, raw inputs) -> WorldState.
// Locked enums:
//   weather.condition: clear | clouds | fog | rain | snow | thunderstorm
//   timeOfDay:         dawn | morning | midday | afternoon | dusk | night
// =============================================================

export const WEATHER_CONDITIONS = [
  "clear",
  "clouds",
  "fog",
  "rain",
  "snow",
  "thunderstorm",
];

export const TIMES_OF_DAY = [
  "dawn",
  "morning",
  "midday",
  "afternoon",
  "dusk",
  "night",
];

// WMO weather_code -> locked 6-state condition enum.
// Reference: Open-Meteo docs, WMO 4677 interpretation codes.
export function conditionFromWmoCode(code) {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "clouds";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return "clouds"; // safe fallback for unknown codes
}

// Clock-based timeOfDay. Phase 2: solar-anchored via sunrise/sunset.
export function timeOfDayFromDate(date, boundaries) {
  const h = date.getHours();
  if (h >= boundaries.night || h < boundaries.dawn) return "night";
  if (h < boundaries.morning) return "dawn";
  if (h < boundaries.midday) return "morning";
  if (h < boundaries.afternoon) return "midday";
  if (h < boundaries.dusk) return "afternoon";
  return "dusk";
}

function daysBetween(aIso, bIso) {
  const a = new Date(aIso + "T00:00:00");
  const b = new Date(bIso + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

export function vacationStateFromDate(now, vacation) {
  const todayIso = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const totalDays = daysBetween(vacation.startDate, vacation.endDate) + 1;
  const daysUntilStart = daysBetween(todayIso, vacation.startDate);
  const daysUntilEnd = daysBetween(todayIso, vacation.endDate);

  if (daysUntilStart > 0) {
    return { phase: "countdown", daysUntilStart, totalDays };
  }
  if (daysUntilEnd >= 0) {
    return {
      phase: "active",
      dayNumber: totalDays - daysUntilEnd,
      daysRemaining: daysUntilEnd,
      totalDays,
    };
  }
  return { phase: "over", totalDays };
}

// Assemble the full WorldState. Everything the UI renders flows
// through this object — sky backdrop and widgets alike.
export function deriveWorldState({ config, now, rawWeather, events, announcements }) {
  return {
    now,
    timeOfDay: timeOfDayFromDate(now, config.timeOfDayBoundaries),
    weather: rawWeather
      ? {
          condition: conditionFromWmoCode(rawWeather.weatherCode),
          temperatureF: Math.round(rawWeather.temperatureF),
          highF: Math.round(rawWeather.highF),
          lowF: Math.round(rawWeather.lowF),
          windMph: Math.round(rawWeather.windMph),
          isLoading: false,
        }
      : { condition: "clear", isLoading: true },
    vacation: vacationStateFromDate(now, config.vacation),
    events: events ?? [],
    announcements: announcements ?? [],
  };
}
