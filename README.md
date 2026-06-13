# MatchCast ⚽

Browser-based FIFA World Cup 2026 fan app. Browse group standings, update match results, and get predictions for any matchup between the 48 qualified nations.

## Features

- **Group standings** — all 12 groups (A–L), live points table that updates as you enter results
- **Schedule** — full group stage calendar (72 fixtures, Jun 11–28) with kick-off times and venues; click any score to enter results
- **Inline score editing** — press Enter or Save to confirm, Escape to cancel; results persist across reloads
- **Match prediction** — select any two WC 2026 teams to get a predicted score, win/draw/loss probabilities, and side-by-side stat comparison
- **Team profiles** — click any team name to see FIFA ranking, strength score, attack/defence stats, form history, and upcoming fixtures
- **Stats** — compare scoreline distributions: historical WC 1986–2022 data vs engine predictions vs your entered results
- **Settings** — tune the prediction engine weights and xG formula parameters in real time
- **EN/PL language toggle**

## How to Run

Requires Python 3 or Node.js (for `npx serve`).

```bash
# Clone the repository
git clone https://github.com/mehoweck/matchcast.git
cd matchcast

# Option 1 — Python (no install needed)
python3 -m http.server 3000

# Option 2 — Node.js
npx serve . --listen 3000
```

Open **http://localhost:3000** in your browser.

> The app uses ES Modules, so it must be served over HTTP — opening `index.html` directly via `file://` will not work.

## Prediction Engine

Each team receives a **Strength Score (0–100)** computed from five equally-weighted criteria:

| Criterion | Weight | Source |
|---|---|---|
| FIFA ranking (pool-normalised) | 25% | June 2026 rankings |
| Form points (last 10 matches) | 25% | W=3, D=1, L=0 |
| Attack (goals/game) | 20% | Last 10 matches |
| Defence (goals conceded/game) | 20% | Last 10 matches, inverted |
| WC experience + star players | 10% | Appearances + top-100 players |

**Win probabilities** use a logistic spread from the strength difference between teams, clamped to realistic ranges (5%–90% per outcome).

**Predicted score** is derived from a Dixon-Coles-style expected goals model: each team's goals-per-game rate is scaled by the opponent's defensive quality relative to the pool average, then adjusted by the strength difference. The most likely score under a Poisson distribution is shown.

## Data

- **48 teams** from the confirmed WC 2026 draw (December 5, 2025, Kennedy Center, Washington D.C.)
- **72 group stage fixtures** across 12 groups
- Match results are saved in browser `localStorage` — they persist across page reloads

## Project Structure

```
matchcast/
  index.html          entry point
  style.css           Pitch Green theme
  data/
    teams.js          48 team objects with stats
    schedule.js       72 group stage fixtures
  engine/
    predictor.js      strength scoring + prediction algorithm
  ui/
    components.js     HTML string builders
    app.js            state, routing, event handling
```
