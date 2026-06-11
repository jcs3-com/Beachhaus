// Placeholder announcements, used until a Google Sheet CSV URL is configured.
function todayAt(h, m = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export const sampleAnnouncements = [
  {
    postedAt: todayAt(8, 12),
    name: "Mom",
    message: "Sunscreen is in the blue bag by the door. Use it.",
  },
  {
    postedAt: todayAt(10, 47),
    name: "Dad",
    message: "Outdoor shower is family-only until the sand situation improves.",
  },
];
