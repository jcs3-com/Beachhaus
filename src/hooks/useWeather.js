import { useEffect, useState } from "react";

// Open-Meteo: keyless, CORS-friendly. Uses the WMO weather_code field
// per the locked data-source decision.
export function useWeather(config) {
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { latitude, longitude, timezone } = config.location;
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph` +
      `&timezone=${encodeURIComponent(timezone)}&forecast_days=1`;

    let cancelled = false;

    async function fetchWeather() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setRaw({
          temperatureF: data.current.temperature_2m,
          weatherCode: data.current.weather_code,
          windMph: data.current.wind_speed_10m,
          highF: data.daily.temperature_2m_max[0],
          lowF: data.daily.temperature_2m_min[0],
          // Phase 2: solar anchors for timeOfDay. Open-Meteo returns
          // local ISO strings when a timezone is requested.
          sunrise: new Date(data.daily.sunrise[0]),
          sunset: new Date(data.daily.sunset[0]),
        });
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e);
      }
    }

    fetchWeather();
    const id = setInterval(fetchWeather, config.weather.refreshMinutes * 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [config]);

  return { raw, error };
}
