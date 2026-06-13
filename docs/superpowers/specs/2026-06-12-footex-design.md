# Footex — Football Prediction App: Design Spec

**Date:** 2026-06-12  
**Stack:** Pure HTML + CSS + ES Modules (no build tools, no framework)  
**Runtime:** Local only — `npx serve .` or `python -m http.server`

---

## Overview

A browser-based app for football fans following FIFA World Cup 2026. Users can browse group standings, update match results inline, and get AI-style predictions for any match between the 32 participating nations.

---

## Architecture

### File Structure

```
footex/
  index.html          — single entry point, nav + view container
  style.css           — global styles (Pitch Green theme)
  data/
    teams.js          — stats for all 32 WC 2026 teams (ES module export)
    schedule.js       — full WC 2026 fixture list with groups and match IDs
  engine/
    predictor.js      — pure prediction function: (teamA, teamB) → result
  ui/
    app.js            — state management, routing, event handling
    components.js     — HTML fragment builders (team card, group table, etc.)
```

### Data Flow

```
teams.js + schedule.js
  → predictor.js   pure function, no side effects
  → app.js         manages state (localStorage), renders views
  → DOM
```

### State

Match results entered by the user are persisted in `localStorage` as:
```json
{ "GRP_A_1": { "home": 2, "away": 1 } }
```
`matchId` format: `GRP_{group}_{n}` (e.g. `GRP_A_1`, `GRP_B_3`). Defined in `schedule.js` on each fixture object.
Team stats are static — defined in `data/teams.js`, never mutated at runtime.

---

## Team Data Model

Each of the 32 teams has the following fields (identical schema, sourced from FIFA rankings and last-10-match stats as of April 2025):

```js
{
  id: "POL",
  name: "Poland",
  flag: "🇵🇱",
  group: "C",

  // Global ranking
  fifaRanking: 28,
  fifaPoints: 1423,

  // Attack (last 10 matches)
  goalsScored: 18,
  goalsPerGame: 1.8,
  bigChancesCreated: 22,

  // Defense (last 10 matches)
  goalsConceded: 9,
  goalsAgainstPerGame: 0.9,
  cleanSheets: 4,

  // Form (last 10 matches)
  form: ["W","W","D","L","W","W","D","W","L","W"],
  formPoints: 22,        // W=3, D=1, L=0

  // Experience
  worldCupAppearances: 8,
  starPlayers: 2,        // players in top-100 Ballon d'Or ranking
}
```

---

## Prediction Engine

### Team Strength Score (0–100)

Each team receives a single composite strength score calculated from:

| Criterion | Weight |
|---|---|
| FIFA ranking (normalized: rank 1 → 100, worst rank in the 32-team pool → 0) | 25% |
| Form points (last 10 matches, max 30) | 25% |
| Attack strength (goals/game, normalized) | 20% |
| Defense strength (goals against/game, inverted, normalized) | 20% |
| WC experience + star players (combined, normalized) | 10% |

### Match Prediction Output

```js
{
  homeWinPct: 58,
  drawPct: 22,
  awayWinPct: 20,
  predictedScore: { home: 2, away: 1 },
  favorite: "POL",
  favoriteStrength: 71,   // strength score 0–100
  underdog: "MEX",
  underdogStrength: 63,
}
```

`predictedScore` is derived from each team's expected goals (attack score × defense opponent adjustment), rounded to nearest integer.

---

## Views

### 1. Group Tables (default view)

- All 8 groups displayed in a 2-column grid
- Each group table shows: flag, team name, P W D L GF GA GD Pts
- Standings auto-calculated from results in localStorage
- Clicking a match score opens inline edit mode

### 2. Match Prediction

- Two searchable dropdowns to pick any two of the 32 WC teams
- Output panel:
  - Predicted score (large, prominent)
  - Favorite label + strength bar
  - Win/Draw/Win probability strip (%)
  - Side-by-side team stat cards: attack rating, defense rating, form strip (10 colored boxes: W=green, D=yellow, L=red)
  - Last 10 matches summary

### 3. Team Profile

- Triggered by clicking a team name anywhere in the app
- Shows: FIFA ranking, strength score, full stat breakdown, form history, upcoming group fixtures

### 4. Inline Score Edit

- Clicking a match score in the group table replaces it with two number inputs (home : away)
- Confirmed with Enter or a small "Save" button
- Saves to localStorage, group table re-renders immediately
- Escape cancels edit

---

## Visual Style: Pitch Green

| Token | Value |
|---|---|
| Background | `#064e3b` (deep green) |
| Surface | `#065f46` |
| Accent | `#059669` |
| Text primary | `#ecfdf5` |
| Text secondary | `#6ee7b7` |
| Highlight / scores | `#fbbf24` (gold) |
| Win indicator | `#34d399` |
| Loss indicator | `#f87171` |
| Draw indicator | `#fbbf24` |

Font: system-ui stack. No external font dependencies.

---

## Non-Goals

- No backend, no server-side rendering
- No user accounts or authentication
- No live data / external API calls
- No knockout bracket (group stage only for v1)
- No mobile-specific layout (desktop-first, responsive is a nice-to-have)
