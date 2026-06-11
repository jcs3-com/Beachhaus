// Placeholder agenda data, used until the ICS proxy endpoint exists.
// Times are local; the agenda widget renders today's items in order.
function todayAt(h, m = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export const sampleEvents = [
  { title: "Beach setup — umbrellas & chairs", start: todayAt(9, 0) },
  { title: "Boardwalk fries run", start: todayAt(12, 30) },
  { title: "Low tide — best shelling", start: todayAt(15, 45) },
  { title: "Grill night: burgers & corn", start: todayAt(18, 30) },
  { title: "Mini golf at Captain Jack's", start: todayAt(20, 0) },
];
