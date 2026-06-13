import { TEAMS } from '../data/teams.js';
import { SCHEDULE } from '../data/schedule.js';
import { predict, teamStrength } from '../engine/predictor.js';
import { loadSettings, saveSettings, resetSettings, DEFAULTS } from '../engine/settings.js';
import { groupTable, predictionPanel, teamProfileModal } from './components.js';
import { t, getLang, setLang, LANGS } from './i18n.js';

const STORAGE_KEY = 'matchcast_results';
const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// Results for already-played matches (seeded once; user can overwrite)
const SEEDED_RESULTS = {
  'GRP_A_1': { home: 2, away: 0 }, // Mexico 2–0 South Africa
  'GRP_A_2': { home: 2, away: 1 }, // South Korea 2–1 Czechia
  'GRP_B_1': { home: 1, away: 1 }, // Canada 1–1 Bosnia
  'GRP_D_1': { home: 4, away: 1 }, // USA 4–1 Paraguay
};

// Historical WC 1986-2022 scoreline data (604 matches, computed from jfjelstul/worldcup dataset)
const HISTORICAL = {
  total: 604,
  goals: 1524,
  scorelines: [
    { label: '1:0', count: 129 }, { label: '2:1', count: 103 },
    { label: '2:0', count: 78 },  { label: '1:1', count: 67 },
    { label: '0:0', count: 48 },  { label: '3:0', count: 38 },
    { label: '3:1', count: 32 },  { label: '2:2', count: 25 },
    { label: '3:2', count: 23 },  { label: '4:0', count: 14 },
    { label: '4:1', count: 14 },
  ],
};

// --- State ---
function loadResults() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    // Merge seeded results — stored values win (user may have corrected them)
    return { ...SEEDED_RESULTS, ...stored };
  } catch {
    return { ...SEEDED_RESULTS };
  }
}

function saveResult(matchId, home, away) {
  const results = loadResults();
  results[matchId] = { home, away };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// --- Views ---
function renderGroups() {
  const results = loadResults();
  return `<div class="groups-grid">
    ${GROUPS.map(g => groupTable(g, TEAMS, SCHEDULE, results)).join('')}
  </div>`;
}

function renderPredict(teamAId = '', teamBId = '') {
  const sorted = TEAMS.slice().sort((a, b) => a.name.localeCompare(b.name));
  const makeOptions = (selectedId) => sorted
    .map(t => `<option value="${t.id}" ${t.id === selectedId ? 'selected' : ''}>${t.flag} ${t.name}</option>`)
    .join('');

  let resultHtml = `<div class="placeholder-hint">${t('selectHint')}</div>`;

  if (teamAId && teamBId && teamAId !== teamBId) {
    const teamA = TEAMS.find(t => t.id === teamAId);
    const teamB = TEAMS.find(t => t.id === teamBId);
    if (teamA && teamB) {
      const result = predict(teamA, teamB, TEAMS);
      resultHtml = predictionPanel(result, teamA, teamB);
    }
  }

  return `
    <div class="predict-container">
      <div class="team-selectors">
        <select class="team-select" id="team-a">
          <option value="">${t('selectTeamA')}</option>${makeOptions(teamAId)}
        </select>
        <div class="vs-label">VS</div>
        <select class="team-select" id="team-b">
          <option value="">${t('selectTeamB')}</option>${makeOptions(teamBId)}
        </select>
      </div>
      ${resultHtml}
    </div>`;
}

function buildScorelineMap(matches) {
  // matches: array of { home, away } objects
  // normalise: always store as (higher:lower) unless draw
  const map = new Map();
  let goals = 0;
  for (const m of matches) {
    const h = m.home, a = m.away;
    goals += h + a;
    const key = h === a ? `${h}:${a}` : `${Math.max(h,a)}:${Math.min(h,a)}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return { map, goals };
}

function renderStats() {
  const settings = loadSettings();

  // Engine predictions: run all 72 scheduled group fixtures
  const engineMatches = SCHEDULE.map(f => {
    const home = TEAMS.find(tm => tm.id === f.home);
    const away = TEAMS.find(tm => tm.id === f.away);
    if (!home || !away) return null;
    const r = predict(home, away, TEAMS, settings);
    return { home: r.predictedScore.home, away: r.predictedScore.away };
  }).filter(Boolean);

  // Manual results entered by user
  const results = loadResults();
  const manualMatches = Object.values(results);

  const engineData = buildScorelineMap(engineMatches);
  const manualData = buildScorelineMap(manualMatches);

  // All unique labels union from historical + engine
  const allLabels = new Set(HISTORICAL.scorelines.map(s => s.label));
  engineData.map.forEach((_, k) => allLabels.add(k));
  manualData.map.forEach((_, k) => allLabels.add(k));

  // Sort by historical frequency, then remaining by engine count
  const sortedLabels = Array.from(allLabels).sort((a, b) => {
    const ha = HISTORICAL.scorelines.find(s => s.label === a)?.count || 0;
    const hb = HISTORICAL.scorelines.find(s => s.label === b)?.count || 0;
    if (hb !== ha) return hb - ha;
    return (engineData.map.get(b) || 0) - (engineData.map.get(a) || 0);
  });

  const engTotal = engineMatches.length;
  const manTotal = manualMatches.length;

  function pct(count, total) {
    if (!total) return '—';
    return (count / total * 100).toFixed(1) + '%';
  }

  function bar(count, total) {
    if (!total || !count) return '';
    const w = Math.round(count / total * 100);
    return `<div class="stats-bar"><div class="stats-bar-fill" style="width:${w}%"></div></div>`;
  }

  const rows = sortedLabels.map(label => {
    const hCount = HISTORICAL.scorelines.find(s => s.label === label)?.count || 0;
    const eCount = engineData.map.get(label) || 0;
    const mCount = manualData.map.get(label) || 0;
    if (!hCount && !eCount && !mCount) return '';
    return `
      <tr>
        <td class="stats-score-label">${label}</td>
        <td class="stats-cell">
          <span class="stats-pct">${pct(hCount, HISTORICAL.total)}</span>
          <span class="stats-count">(${hCount})</span>
          ${bar(hCount, HISTORICAL.total)}
        </td>
        <td class="stats-cell">
          <span class="stats-pct">${pct(eCount, engTotal)}</span>
          <span class="stats-count">(${eCount})</span>
          ${bar(eCount, engTotal)}
        </td>
        <td class="stats-cell ${!manTotal ? 'stats-dimmed' : ''}">
          ${manTotal
            ? `<span class="stats-pct">${pct(mCount, manTotal)}</span>
               <span class="stats-count">(${mCount})</span>
               ${bar(mCount, manTotal)}`
            : `<span class="stats-no-data">${t('statsNoData')}</span>`}
        </td>
      </tr>`;
  }).join('');

  const hGpg = (HISTORICAL.goals / HISTORICAL.total).toFixed(2);
  const eGpg = engTotal ? (engineData.goals / engTotal).toFixed(2) : '—';
  const mGpg = manTotal ? (manualData.goals / manTotal).toFixed(2) : '—';

  return `
    <div class="stats-container">
      <h2 class="section-title">${t('statsTitle')}</h2>
      <div class="stats-meta-row">
        <div class="stats-meta-card">
          <div class="stats-meta-label">${t('statsHistorical')}</div>
          <div class="stats-meta-value">${HISTORICAL.total} ${t('statsMatches')} · ${hGpg} ${t('statsGpg')}</div>
        </div>
        <div class="stats-meta-card">
          <div class="stats-meta-label">${t('statsEngine')}</div>
          <div class="stats-meta-value">${engTotal} ${t('statsMatches')} · ${eGpg} ${t('statsGpg')}</div>
        </div>
        <div class="stats-meta-card">
          <div class="stats-meta-label">${t('statsManual')}</div>
          <div class="stats-meta-value">${manTotal ? `${manTotal} ${t('statsMatches')} · ${mGpg} ${t('statsGpg')}` : t('statsNoData')}</div>
        </div>
      </div>
      <div class="stats-table-wrap">
        <table class="stats-table">
          <thead>
            <tr>
              <th></th>
              <th>${t('statsHistorical')}</th>
              <th>${t('statsEngine')}</th>
              <th>${t('statsManual')}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderSettings() {
  const s = loadSettings();

  const weightFields = [
    { key: 'weightRanking',    label: t('weightRanking'),    min: 0, max: 1, step: 0.05 },
    { key: 'weightForm',       label: t('weightForm'),       min: 0, max: 1, step: 0.05 },
    { key: 'weightAttack',     label: t('weightAttack'),     min: 0, max: 1, step: 0.05 },
    { key: 'weightDefence',    label: t('weightDefence'),    min: 0, max: 1, step: 0.05 },
    { key: 'weightExperience', label: t('weightExperience'), min: 0, max: 1, step: 0.05 },
  ];

  const formulaFields = [
    { key: 'xgBaseHome',       label: t('xgBaseHome'),       min: 0.5, max: 1.5, step: 0.05 },
    { key: 'xgStrengthImpact', label: t('xgStrengthImpact'), min: 0,   max: 1,   step: 0.05 },
    { key: 'probBaseHome',     label: t('probBaseHome'),     min: 0.3, max: 0.65, step: 0.01 },
    { key: 'probDrawBase',     label: t('probDrawBase'),     min: 0.1, max: 0.4,  step: 0.01 },
    { key: 'probDrawDecay',    label: t('probDrawDecay'),    min: 0,   max: 0.01, step: 0.001 },
  ];

  const weightTotal = (s.weightRanking + s.weightForm + s.weightAttack + s.weightDefence + s.weightExperience).toFixed(2);
  const totalOk = Math.abs(parseFloat(weightTotal) - 1.0) < 0.01;

  function sliderRow(f) {
    const val = s[f.key];
    const defVal = DEFAULTS[f.key];
    const changed = Math.abs(val - defVal) > 0.0001;
    return `
      <div class="settings-row">
        <label class="settings-label" for="s-${f.key}">
          ${f.label}
          ${changed ? `<span class="settings-changed-dot" title="Modified"></span>` : ''}
        </label>
        <div class="settings-control">
          <input type="range" class="settings-slider" id="s-${f.key}"
            data-setting="${f.key}" min="${f.min}" max="${f.max}" step="${f.step}"
            value="${val}">
          <span class="settings-value" id="v-${f.key}">${val}</span>
        </div>
      </div>`;
  }

  return `
    <div class="settings-container">
      <div class="settings-header">
        <h2 class="section-title">${t('settingsTitle')}</h2>
        <button class="reset-btn" id="settings-reset">${t('settingsReset')}</button>
      </div>

      <div class="settings-card">
        <div class="settings-section-title">${t('settingsWeights')}</div>
        ${weightFields.map(sliderRow).join('')}
        <div class="settings-row settings-total-row">
          <span class="settings-label">${t('weightTotal')}</span>
          <span class="settings-total ${totalOk ? '' : 'settings-total-error'}" id="weight-total">${weightTotal}</span>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-section-title">${t('settingsFormula')}</div>
        ${formulaFields.map(sliderRow).join('')}
      </div>

      <div class="settings-actions">
        <button class="apply-btn" id="settings-apply">${t('settingsApply')}</button>
        <span class="settings-saved-msg" id="settings-saved-msg"></span>
      </div>
    </div>`;
}

function renderSchedule() {
  const results = loadResults();
  const teamById = Object.fromEntries(TEAMS.map(tm => [tm.id, tm]));

  // Group fixtures by date, sorted chronologically
  const byDate = new Map();
  for (const f of SCHEDULE) {
    if (!byDate.has(f.date)) byDate.set(f.date, []);
    byDate.get(f.date).push(f);
  }
  const sortedDates = Array.from(byDate.keys()).sort();

  // Derive matchday label: 1 = Jun 11-12, 2 = Jun 13-16, 3 = Jun 17-20, 4 = Jun 21-23
  // Simpler: just label by index within the 3 rounds (each team plays 3 games)
  // We'll use a date → round mapping based on sorted unique dates
  const uniqueDates = sortedDates;
  // Dates cluster in 3 windows; assign matchday by date index within windows
  // Round 1: 2026-06-11..14, Round 2: 2026-06-15..19, Round 3: 2026-06-20..23
  function matchdayNum(date) {
    if (date <= '2026-06-18') return 1;
    if (date <= '2026-06-24') return 2;
    return 3;
  }

  function formatDate(dateStr) {
    const [, m, d] = dateStr.split('-');
    const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(d)} ${months[parseInt(m)]}`;
  }

  const totalEntered = Object.keys(results).length;
  const totalPending = SCHEDULE.length - totalEntered;

  const sections = sortedDates.map(date => {
    const fixtures = byDate.get(date);
    const md = matchdayNum(date);

    const rows = fixtures.map(f => {
      const home = teamById[f.home];
      const away = teamById[f.away];
      const r = results[f.id];
      const scoreHtml = r
        ? `<span class="fixture-score" data-match="${f.id}">${r.home}:${r.away}</span>`
        : `<span class="fixture-score pending" data-match="${f.id}">vs</span>`;

      return `
        <div class="sched-fixture-row">
          <span class="sched-time">${f.time}</span>
          <span class="sched-group-badge">Gr. ${f.group}</span>
          <div class="sched-teams">
            <button class="team-name-btn" data-team="${f.home}">${home ? home.flag + ' ' + home.name : f.home}</button>
            ${scoreHtml}
            <button class="team-name-btn" data-team="${f.away}">${away ? away.flag + ' ' + away.name : f.away}</button>
          </div>
          <span class="sched-venue">${f.venue}</span>
        </div>`;
    }).join('');

    return `
      <div class="sched-day-block">
        <div class="sched-day-header">
          <span class="sched-day-date">${formatDate(date)}</span>
          <span class="sched-day-round">${t('scheduleMatchday')} ${md}</span>
        </div>
        ${rows}
      </div>`;
  }).join('');

  return `
    <div class="schedule-container">
      <div class="schedule-header">
        <h2 class="section-title">${t('scheduleTitle')}</h2>
        <div class="schedule-summary">
          <span class="sched-summary-pill entered">${totalEntered} ${t('scheduleEntered')}</span>
          <span class="sched-summary-pill pending">${totalPending} ${t('schedulePending')}</span>
        </div>
      </div>
      <div class="sched-days">${sections}</div>
    </div>`;
}


function startInlineEdit(matchId) {
  if (document.querySelector('[data-editing]')) return;
  const scoreEl = document.querySelector(`[data-match="${matchId}"]`);
  if (!scoreEl) return;

  const results = loadResults();
  const existing = results[matchId];
  const homeVal = existing ? existing.home : '';
  const awayVal = existing ? existing.away : '';

  scoreEl.outerHTML = `
    <span class="inline-edit" data-editing="${matchId}">
      <input class="score-input" id="edit-home" type="number" min="0" max="99" value="${homeVal}" placeholder="0">
      <span>:</span>
      <input class="score-input" id="edit-away" type="number" min="0" max="99" value="${awayVal}" placeholder="0">
      <button class="save-btn" data-save="${matchId}">Save</button>
    </span>`;

  document.getElementById('edit-home').focus();
}

function commitInlineEdit(matchId) {
  const homeInput = document.getElementById('edit-home');
  const awayInput = document.getElementById('edit-away');
  if (!homeInput || !awayInput) return;

  const homeRaw = homeInput.value.trim();
  const awayRaw = awayInput.value.trim();
  const home = parseInt(homeRaw, 10);
  const away = parseInt(awayRaw, 10);

  if (homeRaw !== '' && awayRaw !== '' && !isNaN(home) && !isNaN(away)) {
    saveResult(matchId, Math.max(0, home), Math.max(0, away));
  }
  renderApp();
}

function cancelInlineEdit() {
  renderApp();
}

// --- Team profile modal ---
function showTeamProfile(teamId) {
  const team = TEAMS.find(t => t.id === teamId);
  if (!team) return;
  const strength = teamStrength(team, TEAMS);
  const upcoming = SCHEDULE.filter(f => (f.home === teamId || f.away === teamId) && !loadResults()[f.id]);
  document.getElementById('team-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', teamProfileModal(team, strength, upcoming, TEAMS));

  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('team-modal').remove();
  });
  document.getElementById('team-modal').addEventListener('click', (e) => {
    if (e.target.id === 'team-modal') document.getElementById('team-modal').remove();
  });
}

// --- Settings sliders live update ---
function wireSettings() {
  document.querySelectorAll('.settings-slider').forEach(slider => {
    slider.addEventListener('input', () => {
      const valEl = document.getElementById(`v-${slider.dataset.setting}`);
      if (valEl) valEl.textContent = parseFloat(slider.value).toFixed(
        slider.dataset.setting.startsWith('probDrawDecay') ? 3 : 2
      );
      updateWeightTotal();
    });
  });

  document.getElementById('settings-apply')?.addEventListener('click', applySettings);
  document.getElementById('settings-reset')?.addEventListener('click', () => {
    resetSettings();
    renderApp('settings');
  });
}

function updateWeightTotal() {
  const keys = ['weightRanking','weightForm','weightAttack','weightDefence','weightExperience'];
  let sum = 0;
  keys.forEach(k => {
    const el = document.getElementById(`s-${k}`);
    if (el) sum += parseFloat(el.value);
  });
  const total = sum.toFixed(2);
  const el = document.getElementById('weight-total');
  if (el) {
    el.textContent = total;
    const ok = Math.abs(parseFloat(total) - 1.0) < 0.01;
    el.className = `settings-total ${ok ? '' : 'settings-total-error'}`;
  }
}

function applySettings() {
  const current = loadSettings();
  document.querySelectorAll('.settings-slider').forEach(slider => {
    current[slider.dataset.setting] = parseFloat(slider.value);
  });
  saveSettings(current);
  const msg = document.getElementById('settings-saved-msg');
  if (msg) {
    msg.textContent = t('settingsSaved') + ' ✓';
    msg.classList.add('visible');
    setTimeout(() => msg.classList.remove('visible'), 2000);
  }
  // update changed dots without full re-render
  renderApp('settings');
}

// --- Nav render ---
function renderNav() {
  const lang = getLang();
  const navEl = document.querySelector('.nav-links');
  if (navEl) {
    navEl.innerHTML = `
      <a href="#" class="nav-link ${currentView === 'groups'   ? 'active' : ''}" data-view="groups">${t('navGroups')}</a>
      <a href="#" class="nav-link ${currentView === 'schedule' ? 'active' : ''}" data-view="schedule">${t('navSchedule')}</a>
      <a href="#" class="nav-link ${currentView === 'predict'  ? 'active' : ''}" data-view="predict">${t('navPredict')}</a>
      <a href="#" class="nav-link ${currentView === 'stats'    ? 'active' : ''}" data-view="stats">${t('navStats')}</a>
      <a href="#" class="nav-link ${currentView === 'settings' ? 'active' : ''}" data-view="settings">${t('navSettings')}</a>
      <div class="lang-toggle">
        ${LANGS.map(l => `<button class="lang-btn ${l === lang ? 'active' : ''}" data-lang="${l}">${l.toUpperCase()}</button>`).join('')}
      </div>`;
  }
}

// --- Main render ---
let currentView = 'groups';

function renderApp(view) {
  currentView = view || currentView;
  const app = document.getElementById('app');
  renderNav();

  if (currentView === 'groups') {
    app.innerHTML = renderGroups();
  } else if (currentView === 'schedule') {
    app.innerHTML = renderSchedule();
  } else if (currentView === 'predict') {
    const aId = document.getElementById('team-a')?.value || '';
    const bId = document.getElementById('team-b')?.value || '';
    app.innerHTML = renderPredict(aId, bId);
    wirePredict();
  } else if (currentView === 'stats') {
    app.innerHTML = renderStats();
  } else if (currentView === 'settings') {
    app.innerHTML = renderSettings();
    wireSettings();
  }
}

function wirePredict() {
  ['team-a', 'team-b'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      renderApp('predict');
    });
  });
}

// --- Event delegation ---
document.addEventListener('click', (e) => {
  // Language toggle
  const langBtn = e.target.closest('[data-lang]');
  if (langBtn) {
    setLang(langBtn.dataset.lang);
    renderApp();
    return;
  }

  // Nav links
  const navLink = e.target.closest('[data-view]');
  if (navLink) {
    e.preventDefault();
    renderApp(navLink.dataset.view);
    return;
  }

  // Fixture score click → start inline edit
  const scoreEl = e.target.closest('.fixture-score');
  if (scoreEl) {
    startInlineEdit(scoreEl.dataset.match);
    return;
  }

  // Save button in inline edit
  const saveBtn = e.target.closest('[data-save]');
  if (saveBtn) {
    commitInlineEdit(saveBtn.dataset.save);
    return;
  }

  // Team name → profile modal
  const teamBtn = e.target.closest('[data-team]');
  if (teamBtn) {
    showTeamProfile(teamBtn.dataset.team);
    return;
  }
});

// Escape cancels inline edit; Enter inside an edit input commits it
document.addEventListener('keydown', (e) => {
  const editing = document.querySelector('[data-editing]');
  if (!editing) return;
  if (e.key === 'Escape') { cancelInlineEdit(); return; }
  if (e.key === 'Enter' && e.target.closest('[data-editing]')) {
    commitInlineEdit(editing.dataset.editing);
  }
});

// Boot
renderApp('groups');
