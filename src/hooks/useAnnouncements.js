import { useEffect, useState } from "react";
import { sampleAnnouncements } from "../data/sampleAnnouncements.js";

// v1: Google Form -> Sheet -> published CSV. If no csvUrl is configured,
// fall back to sample data so the widget always renders.
//
// Expected sheet columns (Form auto-creates the first):
//   Timestamp, Name, Message
//
// Expiry: default policy is next-local-midnight after posting — family
// notes are ephemeral by default.
export function useAnnouncements(config) {
  const [items, setItems] = useState(null);

  // Optimistic local add: the composer calls this immediately after a
  // (blind, no-cors) form POST so the poster sees their note at once.
  // The next CSV poll reconciles with the sheet of record.
  const addLocal = (note) => setItems((prev) => [note, ...(prev ?? [])]);

  useEffect(() => {
    const url = config.announcements.csvUrl;
    if (!url) {
      setItems(sampleAnnouncements);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Sheet CSV ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        const fresh = applyExpiry(parseCsv(text));
        setItems((prev) => mergeOptimistic(fresh, prev));
      } catch {
        if (!cancelled) setItems(sampleAnnouncements);
      }
    }

    load();
    const id = setInterval(load, 90 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [config]);

  return { items, addLocal };
}

// Minimal CSV parser handling quoted fields (sufficient for Sheets export).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((f) => f !== "")) rows.push(row);
  }

  // Skip header row; map to announcement objects.
  return rows.slice(1).map(([timestamp, name, message]) => ({
    postedAt: new Date(timestamp),
    name: name || "Someone",
    message: message || "",
  }));
}

// next-local-midnight expiry: an announcement posted today survives
// until 00:00 tomorrow, then drops off.
function applyExpiry(items) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return items
    .filter((a) => a.postedAt >= startOfToday && a.message.trim() !== "")
    .sort((a, b) => b.postedAt - a.postedAt);
}

// Keep recently-posted optimistic notes (last 5 min) that the sheet
// export hasn't reflected yet; drop them once the real row appears.
function mergeOptimistic(fresh, prev) {
  if (!prev) return fresh;
  const cutoff = Date.now() - 5 * 60000;
  const pending = prev.filter(
    (p) =>
      p.optimistic &&
      p.postedAt.getTime() > cutoff &&
      !fresh.some((f) => f.message === p.message && f.name === p.name)
  );
  return [...pending, ...fresh].sort((a, b) => b.postedAt - a.postedAt);
}
