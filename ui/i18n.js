const TRANSLATIONS = {
  en: {
    // Nav
    navGroups: 'Groups',
    navPredict: 'Predict',
    navStats: 'Stats',
    navSettings: 'Settings',

    // Groups view
    played: 'P', won: 'W', drawn: 'D', lost: 'L',
    goalsFor: 'GF', goalsAgainst: 'GA', goalDiff: 'GD', points: 'Pts',
    team: 'Team',

    // Predict view
    selectTeamA: 'Select Team A...',
    selectTeamB: 'Select Team B...',
    selectHint: 'Select two teams to see the prediction',
    favourite: 'Favourite',
    drawLikely: 'Draw likely',

    // Schedule view
    navSchedule: 'Schedule',
    scheduleTitle: 'Group Stage Schedule',
    scheduleGroup: 'Group',
    scheduleMatchday: 'Matchday',
    scheduleNoMatches: 'No matches',
    scheduleEntered: 'entered',
    schedulePending: 'pending',

    // Stats view
    statsTitle: 'Scoreline Distribution',
    statsHistorical: 'Historical (WC 1986–2022)',
    statsEngine: 'Engine predictions (72 fixtures)',
    statsManual: 'Manual results (entered)',
    statsMatches: 'matches',
    statsNoData: 'No results entered yet',
    statsGpg: 'Goals/game',
    statsTotal: 'Total matches',

    // Settings view
    settingsTitle: 'Prediction Engine Settings',
    settingsWeights: 'Strength Score Weights',
    settingsFormula: 'xG Formula',
    settingsReset: 'Reset to defaults',
    settingsSaved: 'Saved',
    settingsApply: 'Apply',
    weightRanking: 'FIFA Ranking',
    weightForm: 'Form (last 10)',
    weightAttack: 'Attack (goals/game)',
    weightDefence: 'Defence (conceded/game)',
    weightExperience: 'Experience',
    weightTotal: 'Total',
    xgBaseHome: 'Home team base factor',
    xgStrengthImpact: 'Strength diff impact on xG',
    probBaseHome: 'Home team base win probability',
    probDrawBase: 'Draw base probability',
    probDrawDecay: 'Draw decay per strength point',

    // Modal
    overall: 'Overall',
    attack: 'Attack (Last 10)',
    defence: 'Defence (Last 10)',
    form: 'Form (Last 10)',
    upcoming: 'Upcoming Fixtures',
    strengthScore: 'Strength Score',
    fifaRanking: 'FIFA Ranking',
    fifaPoints: 'FIFA Points',
    wcAppearances: 'WC Appearances',
    goalsScored: 'Goals scored',
    goalsConceded: 'Goals conceded',
    goalsPerGame: 'Goals / game',
    concededPerGame: 'Conceded / game',
    bigChances: 'Big chances created',
    cleanSheets: 'Clean sheets',
    formPoints: 'Form points',
    home: 'Home',
    away: 'Away',
  },

  pl: {
    // Nav
    navGroups: 'Grupy',
    navPredict: 'Prognoza',
    navStats: 'Statystyki',
    navSettings: 'Ustawienia',

    // Groups view
    played: 'M', won: 'W', drawn: 'R', lost: 'P',
    goalsFor: 'Gd', goalsAgainst: 'Gs', goalDiff: 'RG', points: 'Pkt',
    team: 'Drużyna',

    // Predict view
    selectTeamA: 'Wybierz drużynę A...',
    selectTeamB: 'Wybierz drużynę B...',
    selectHint: 'Wybierz dwie drużyny, aby zobaczyć prognozę',
    favourite: 'Faworyt',
    drawLikely: 'Remis prawdopodobny',

    // Schedule view
    navSchedule: 'Harmonogram',
    scheduleTitle: 'Harmonogram fazy grupowej',
    scheduleGroup: 'Grupa',
    scheduleMatchday: 'Kolejka',
    scheduleNoMatches: 'Brak meczów',
    scheduleEntered: 'wpisanych',
    schedulePending: 'oczekujących',

    // Stats view
    statsTitle: 'Rozkład wyników',
    statsHistorical: 'Historyczne (MŚ 1986–2022)',
    statsEngine: 'Predykcje silnika (72 mecze)',
    statsManual: 'Wyniki ręczne (wpisane)',
    statsMatches: 'mecze',
    statsNoData: 'Brak wpisanych wyników',
    statsGpg: 'Gole/mecz',
    statsTotal: 'Liczba meczów',

    // Settings view
    settingsTitle: 'Ustawienia silnika predykcji',
    settingsWeights: 'Wagi punktacji siły drużyny',
    settingsFormula: 'Formuła xG',
    settingsReset: 'Przywróć domyślne',
    settingsSaved: 'Zapisano',
    settingsApply: 'Zastosuj',
    weightRanking: 'Ranking FIFA',
    weightForm: 'Forma (ostatnie 10)',
    weightAttack: 'Atak (gole/mecz)',
    weightDefence: 'Obrona (stracone/mecz)',
    weightExperience: 'Doświadczenie',
    weightTotal: 'Suma',
    xgBaseHome: 'Bazowy współczynnik gospodarz',
    xgStrengthImpact: 'Wpływ różnicy siły na xG',
    probBaseHome: 'Bazowe prawdop. wygranej gospodarza',
    probDrawBase: 'Bazowe prawdop. remisu',
    probDrawDecay: 'Spadek remisu na punkt siły',

    // Modal
    overall: 'Ogólnie',
    attack: 'Atak (ostatnie 10)',
    defence: 'Obrona (ostatnie 10)',
    form: 'Forma (ostatnie 10)',
    upcoming: 'Nadchodzące mecze',
    strengthScore: 'Punktacja siły',
    fifaRanking: 'Ranking FIFA',
    fifaPoints: 'Punkty FIFA',
    wcAppearances: 'MŚ: starty',
    goalsScored: 'Strzelone gole',
    goalsConceded: 'Stracone gole',
    goalsPerGame: 'Gole / mecz',
    concededPerGame: 'Stracone / mecz',
    bigChances: 'Duże szanse',
    cleanSheets: 'Czyste konta',
    formPoints: 'Punkty formy',
    home: 'Gospodarz',
    away: 'Gość',
  },
};

const LANG_KEY = 'matchcast_lang';

let currentLang = localStorage.getItem(LANG_KEY) || 'en';

export function t(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (TRANSLATIONS[lang]) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }
}

export const LANGS = ['en', 'pl'];
