export const WEEK_HOURS = [
  { dow: 0, name: "Sonntag",    is_closed: true,  open: "00:00", close: "00:00" },
  { dow: 1, name: "Montag",     is_closed: false, open: "12:00", close: "21:30" },
  { dow: 2, name: "Dienstag",   is_closed: false, open: "12:00", close: "21:30" },
  { dow: 3, name: "Mittwoch",   is_closed: false, open: "12:00", close: "21:30" },
  { dow: 4, name: "Donnerstag", is_closed: false, open: "12:00", close: "21:30" },
  { dow: 5, name: "Freitag",    is_closed: false, open: "12:00", close: "21:30" },
  { dow: 6, name: "Samstag",    is_closed: true,  open: "00:00", close: "00:00" },
];

export const todayInfo = (hours = WEEK_HOURS) => {
  const d = new Date();
  const row = hours[d.getDay()] || WEEK_HOURS[d.getDay()];
  const text = row.is_closed ? "Geschlossen" : `${row.open} bis ${row.close}`;
  return { name: row.name, text };
};
