// WC 2026 group stage fixtures — 72 matches
// id format: GRP_{group}_{n}
// Results for already-played matches (Jun 11–13) are seeded in app.js
export const SCHEDULE = [
  // ── 11 June ──────────────────────────────────────────────────────────────
  { id: "GRP_A_1", group: "A", home: "MEX", away: "RSA", date: "2026-06-11", time: "21:00", venue: "Mexico City" },

  // ── 12 June ──────────────────────────────────────────────────────────────
  { id: "GRP_A_2", group: "A", home: "KOR", away: "CZE", date: "2026-06-12", time: "04:00", venue: "Guadalajara" },
  { id: "GRP_B_1", group: "B", home: "CAN", away: "BIH", date: "2026-06-12", time: "21:00", venue: "Toronto" },

  // ── 13 June ──────────────────────────────────────────────────────────────
  { id: "GRP_D_1", group: "D", home: "USA", away: "PAR", date: "2026-06-13", time: "03:00", venue: "Los Angeles" },
  { id: "GRP_B_2", group: "B", home: "QAT", away: "SUI", date: "2026-06-13", time: "21:00", venue: "Santa Clara" },

  // ── 14 June ──────────────────────────────────────────────────────────────
  { id: "GRP_C_1", group: "C", home: "BRA", away: "MAR", date: "2026-06-14", time: "00:00", venue: "New Jersey" },
  { id: "GRP_C_2", group: "C", home: "HAI", away: "SCO", date: "2026-06-14", time: "03:00", venue: "Boston" },
  { id: "GRP_D_2", group: "D", home: "AUS", away: "TUR", date: "2026-06-14", time: "06:00", venue: "Vancouver" },
  { id: "GRP_E_1", group: "E", home: "GER", away: "CUW", date: "2026-06-14", time: "19:00", venue: "Houston" },
  { id: "GRP_F_1", group: "F", home: "NED", away: "JPN", date: "2026-06-14", time: "22:00", venue: "Dallas" },

  // ── 15 June ──────────────────────────────────────────────────────────────
  { id: "GRP_E_2", group: "E", home: "CIV", away: "ECU", date: "2026-06-15", time: "01:00", venue: "Philadelphia" },
  { id: "GRP_F_2", group: "F", home: "SWE", away: "TUN", date: "2026-06-15", time: "04:00", venue: "Monterrey" },
  { id: "GRP_H_1", group: "H", home: "ESP", away: "CPV", date: "2026-06-15", time: "18:00", venue: "Atlanta" },
  { id: "GRP_G_1", group: "G", home: "BEL", away: "EGY", date: "2026-06-15", time: "21:00", venue: "Seattle" },

  // ── 16 June ──────────────────────────────────────────────────────────────
  { id: "GRP_H_2", group: "H", home: "SAU", away: "URU", date: "2026-06-16", time: "00:00", venue: "Miami" },
  { id: "GRP_G_2", group: "G", home: "IRN", away: "NZL", date: "2026-06-16", time: "03:00", venue: "Los Angeles" },
  { id: "GRP_I_1", group: "I", home: "FRA", away: "SEN", date: "2026-06-16", time: "21:00", venue: "New Jersey" },

  // ── 17 June ──────────────────────────────────────────────────────────────
  { id: "GRP_I_2", group: "I", home: "IRQ", away: "NOR", date: "2026-06-17", time: "00:00", venue: "Boston" },
  { id: "GRP_J_1", group: "J", home: "ARG", away: "ALG", date: "2026-06-17", time: "03:00", venue: "Kansas City" },
  { id: "GRP_J_2", group: "J", home: "AUT", away: "JOR", date: "2026-06-17", time: "06:00", venue: "Santa Clara" },
  { id: "GRP_K_1", group: "K", home: "POR", away: "COD", date: "2026-06-17", time: "19:00", venue: "Houston" },
  { id: "GRP_L_1", group: "L", home: "ENG", away: "CRO", date: "2026-06-17", time: "22:00", venue: "Dallas" },

  // ── 18 June ──────────────────────────────────────────────────────────────
  { id: "GRP_L_2", group: "L", home: "GHA", away: "PAN", date: "2026-06-18", time: "01:00", venue: "Boston" },
  { id: "GRP_K_2", group: "K", home: "UZB", away: "COL", date: "2026-06-18", time: "04:00", venue: "Mexico City" },
  { id: "GRP_A_3", group: "A", home: "CZE", away: "RSA", date: "2026-06-18", time: "18:00", venue: "Atlanta" },
  { id: "GRP_B_3", group: "B", home: "SUI", away: "BIH", date: "2026-06-18", time: "21:00", venue: "Los Angeles" },

  // ── 19 June ──────────────────────────────────────────────────────────────
  { id: "GRP_B_4", group: "B", home: "CAN", away: "QAT", date: "2026-06-19", time: "00:00", venue: "Vancouver" },
  { id: "GRP_A_4", group: "A", home: "MEX", away: "KOR", date: "2026-06-19", time: "03:00", venue: "Guadalajara" },
  { id: "GRP_D_3", group: "D", home: "USA", away: "AUS", date: "2026-06-19", time: "21:00", venue: "Seattle" },

  // ── 20 June ──────────────────────────────────────────────────────────────
  { id: "GRP_C_3", group: "C", home: "SCO", away: "MAR", date: "2026-06-20", time: "00:00", venue: "Boston" },
  { id: "GRP_C_4", group: "C", home: "BRA", away: "HAI", date: "2026-06-20", time: "03:00", venue: "Philadelphia" },
  { id: "GRP_D_4", group: "D", home: "TUR", away: "PAR", date: "2026-06-20", time: "05:00", venue: "Santa Clara" },
  { id: "GRP_F_3", group: "F", home: "NED", away: "SWE", date: "2026-06-20", time: "19:00", venue: "Houston" },
  { id: "GRP_E_3", group: "E", home: "GER", away: "CIV", date: "2026-06-20", time: "22:00", venue: "Toronto" },

  // ── 21 June ──────────────────────────────────────────────────────────────
  { id: "GRP_E_4", group: "E", home: "ECU", away: "CUW", date: "2026-06-21", time: "02:00", venue: "Kansas City" },
  { id: "GRP_F_4", group: "F", home: "TUN", away: "JPN", date: "2026-06-21", time: "06:00", venue: "Monterrey" },
  { id: "GRP_H_3", group: "H", home: "ESP", away: "SAU", date: "2026-06-21", time: "18:00", venue: "Atlanta" },
  { id: "GRP_G_3", group: "G", home: "BEL", away: "IRN", date: "2026-06-21", time: "21:00", venue: "Los Angeles" },

  // ── 22 June ──────────────────────────────────────────────────────────────
  { id: "GRP_H_4", group: "H", home: "URU", away: "CPV", date: "2026-06-22", time: "00:00", venue: "Miami" },
  { id: "GRP_G_4", group: "G", home: "NZL", away: "EGY", date: "2026-06-22", time: "03:00", venue: "Vancouver" },
  { id: "GRP_J_3", group: "J", home: "ARG", away: "AUT", date: "2026-06-22", time: "19:00", venue: "Dallas" },
  { id: "GRP_I_3", group: "I", home: "FRA", away: "IRQ", date: "2026-06-22", time: "23:00", venue: "Philadelphia" },

  // ── 23 June ──────────────────────────────────────────────────────────────
  { id: "GRP_I_4", group: "I", home: "NOR", away: "SEN", date: "2026-06-23", time: "02:00", venue: "New Jersey" },
  { id: "GRP_J_4", group: "J", home: "JOR", away: "ALG", date: "2026-06-23", time: "05:00", venue: "Santa Clara" },
  { id: "GRP_K_3", group: "K", home: "POR", away: "UZB", date: "2026-06-23", time: "19:00", venue: "Houston" },
  { id: "GRP_L_3", group: "L", home: "ENG", away: "GHA", date: "2026-06-23", time: "22:00", venue: "Boston" },

  // ── 24 June ──────────────────────────────────────────────────────────────
  { id: "GRP_L_4", group: "L", home: "PAN", away: "CRO", date: "2026-06-24", time: "01:00", venue: "Toronto" },
  { id: "GRP_K_4", group: "K", home: "COL", away: "COD", date: "2026-06-24", time: "04:00", venue: "Guadalajara" },
  { id: "GRP_B_5", group: "B", home: "SUI", away: "CAN", date: "2026-06-24", time: "21:00", venue: "Vancouver" },
  { id: "GRP_B_6", group: "B", home: "BIH", away: "QAT", date: "2026-06-24", time: "21:00", venue: "Seattle" },

  // ── 25 June ──────────────────────────────────────────────────────────────
  { id: "GRP_C_5", group: "C", home: "MAR", away: "HAI", date: "2026-06-25", time: "00:00", venue: "Atlanta" },
  { id: "GRP_C_6", group: "C", home: "SCO", away: "BRA", date: "2026-06-25", time: "00:00", venue: "Miami" },
  { id: "GRP_A_5", group: "A", home: "RSA", away: "KOR", date: "2026-06-25", time: "03:00", venue: "Monterrey" },
  { id: "GRP_A_6", group: "A", home: "CZE", away: "MEX", date: "2026-06-25", time: "03:00", venue: "Mexico City" },
  { id: "GRP_E_5", group: "E", home: "CUW", away: "CIV", date: "2026-06-25", time: "22:00", venue: "Philadelphia" },
  { id: "GRP_E_6", group: "E", home: "ECU", away: "GER", date: "2026-06-25", time: "22:00", venue: "New Jersey" },

  // ── 26 June ──────────────────────────────────────────────────────────────
  { id: "GRP_F_5", group: "F", home: "JPN", away: "SWE", date: "2026-06-26", time: "01:00", venue: "Dallas" },
  { id: "GRP_F_6", group: "F", home: "TUN", away: "NED", date: "2026-06-26", time: "01:00", venue: "Kansas City" },
  { id: "GRP_D_5", group: "D", home: "PAR", away: "AUS", date: "2026-06-26", time: "04:00", venue: "Santa Clara" },
  { id: "GRP_D_6", group: "D", home: "TUR", away: "USA", date: "2026-06-26", time: "04:00", venue: "Los Angeles" },
  { id: "GRP_I_5", group: "I", home: "NOR", away: "FRA", date: "2026-06-26", time: "21:00", venue: "Boston" },
  { id: "GRP_I_6", group: "I", home: "SEN", away: "IRQ", date: "2026-06-26", time: "21:00", venue: "Toronto" },

  // ── 27 June ──────────────────────────────────────────────────────────────
  { id: "GRP_H_5", group: "H", home: "CPV", away: "SAU", date: "2026-06-27", time: "02:00", venue: "Houston" },
  { id: "GRP_H_6", group: "H", home: "URU", away: "ESP", date: "2026-06-27", time: "02:00", venue: "Guadalajara" },
  { id: "GRP_G_5", group: "G", home: "EGY", away: "IRN", date: "2026-06-27", time: "05:00", venue: "Seattle" },
  { id: "GRP_G_6", group: "G", home: "NZL", away: "BEL", date: "2026-06-27", time: "05:00", venue: "Vancouver" },
  { id: "GRP_L_5", group: "L", home: "CRO", away: "GHA", date: "2026-06-27", time: "23:00", venue: "Philadelphia" },
  { id: "GRP_L_6", group: "L", home: "PAN", away: "ENG", date: "2026-06-27", time: "23:00", venue: "New Jersey" },

  // ── 28 June ──────────────────────────────────────────────────────────────
  { id: "GRP_K_5", group: "K", home: "COD", away: "UZB", date: "2026-06-28", time: "01:30", venue: "Atlanta" },
  { id: "GRP_K_6", group: "K", home: "COL", away: "POR", date: "2026-06-28", time: "01:30", venue: "Miami" },
  { id: "GRP_J_5", group: "J", home: "ALG", away: "AUT", date: "2026-06-28", time: "04:00", venue: "Kansas City" },
  { id: "GRP_J_6", group: "J", home: "JOR", away: "ARG", date: "2026-06-28", time: "04:00", venue: "Dallas" },
];
