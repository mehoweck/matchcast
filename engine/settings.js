const SETTINGS_KEY = 'footex_engine_settings';

export const DEFAULTS = {
  // Strength score weights (must sum to 1.0)
  weightRanking:    0.25,
  weightForm:       0.25,
  weightAttack:     0.20,
  weightDefence:    0.20,
  weightExperience: 0.10,

  // xG formula
  xgBaseHome:       0.85,   // base multiplier for home team xG
  xgStrengthImpact: 0.30,   // how much strength diff shifts xG up/down

  // Win probability formula
  probBaseHome:     0.45,   // home team base win probability
  probDrawBase:     0.22,   // base draw probability
  probDrawDecay:    0.002,  // draw probability decrease per strength point diff
};

export function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return stored ? { ...DEFAULTS, ...stored } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY);
  return { ...DEFAULTS };
}
