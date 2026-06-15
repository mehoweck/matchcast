import { loadSettings } from './settings.js';

// Normalize value to [0, 1]. Returns 0 if max === min (degenerate range).
function normalize(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

export function teamStrength(team, allTeams, settings) {
  const s = settings || loadSettings();

  const bestRank = Math.min(...allTeams.map(t => t.fifaRanking));
  const worstRank = Math.max(...allTeams.map(t => t.fifaRanking));
  const rankScore = normalize(worstRank - team.fifaRanking, 0, worstRank - bestRank);

  const minForm = Math.min(...allTeams.map(t => t.formPoints));
  const maxForm = Math.max(...allTeams.map(t => t.formPoints));
  const formScore = normalize(team.formPoints, minForm, maxForm);

  const minAttack = Math.min(...allTeams.map(t => t.goalsPerGame));
  const maxAttack = Math.max(...allTeams.map(t => t.goalsPerGame));
  const attackScore = normalize(team.goalsPerGame, minAttack, maxAttack);

  const minConceded = Math.min(...allTeams.map(t => t.goalsAgainstPerGame));
  const maxConceded = Math.max(...allTeams.map(t => t.goalsAgainstPerGame));
  const defenseScore = normalize(maxConceded - team.goalsAgainstPerGame, 0, maxConceded - minConceded);

  const expRaws = allTeams.map(t => t.worldCupAppearances + t.starPlayers * 2);
  const maxExp = Math.max(...expRaws);
  const expRaw = team.worldCupAppearances + team.starPlayers * 2;
  const expScore = normalize(expRaw, 0, maxExp);

  const strength =
    rankScore    * s.weightRanking +
    formScore    * s.weightForm +
    attackScore  * s.weightAttack +
    defenseScore * s.weightDefence +
    expScore     * s.weightExperience;

  return Math.round(strength * 100);
}

/**
 * Predict the outcome of a match between homeTeam and awayTeam.
 * teamA is the HOME side — the 45% baseline win rate reflects home advantage.
 *
 * Returns probability percentages (integer, summing to 100), a predicted score,
 * and metadata about the favorite/underdog.
 */
export function predict(homeTeam, awayTeam, allTeams, settingsOverride) {
  const s = settingsOverride || loadSettings();
  const strengthA = teamStrength(homeTeam, allTeams, s);
  const strengthB = teamStrength(awayTeam, allTeams, s);

  // --- Probabilities ---
  const diff = strengthA - strengthB;
  const rawA = s.probBaseHome + diff * 0.006;
  const rawDraw = s.probDrawBase - Math.abs(diff) * s.probDrawDecay;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const pA = clamp(rawA, 0.05, 0.90);
  const pDraw = clamp(rawDraw, 0.05, 0.35);
  const pB = clamp(1 - pA - pDraw, 0.05, 0.90);

  const total = pA + pDraw + pB;
  const homeWinPct = Math.round((pA / total) * 100);
  const drawPct = Math.round((pDraw / total) * 100);
  const awayWinPct = 100 - homeWinPct - drawPct;

  // --- Predicted score (Dixon-Coles xG + Poisson mode) ---
  const avgConceded = allTeams.reduce((sum, t) => sum + t.goalsAgainstPerGame, 0) / allTeams.length;
  const strDiff = (strengthA - strengthB) / 100;

  const rawXgA = homeTeam.goalsPerGame * (awayTeam.goalsAgainstPerGame / avgConceded);
  const rawXgB = awayTeam.goalsPerGame * (homeTeam.goalsAgainstPerGame / avgConceded);

  const xgA = Math.max(0, rawXgA * (s.xgBaseHome + strDiff * s.xgStrengthImpact));
  const xgB = Math.max(0, rawXgB * (s.xgBaseHome - strDiff * s.xgStrengthImpact));

  const scoreA = Math.round(xgA);
  const scoreB = Math.round(xgB);

  const [favorite, favoriteStrength, underdog, underdogStrength] =
    strengthA >= strengthB
      ? [homeTeam.id, strengthA, awayTeam.id, strengthB]
      : [awayTeam.id, strengthB, homeTeam.id, strengthA];

  return {
    homeWinPct,
    drawPct,
    awayWinPct,
    predictedScore: { home: scoreA, away: scoreB },
    xg: { home: Math.round(xgA * 10) / 10, away: Math.round(xgB * 10) / 10 },
    favorite,
    favoriteStrength,
    underdog,
    underdogStrength,
    strengthA,
    strengthB,
  };
}
