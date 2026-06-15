import { t } from './i18n.js';

export function formStrip(formArray) {
  return formArray.map(r =>
    `<span class="form-box ${r}">${r}</span>`
  ).join('');
}

export function strengthBar(score, label) {
  const pct = Math.min(100, Math.max(0, Number(score) || 0));
  return `
    <div class="strength-bar-wrap">
      <div class="strength-label"><span>${label}</span><span>${pct}/100</span></div>
      <div class="strength-bar"><div class="strength-fill" style="width:${pct}%"></div></div>
    </div>`;
}

export function teamStatCard(team, strength) {
  return `
    <div class="team-stat-card">
      <div class="stat-card-title">${team.flag} ${team.name}</div>
      ${strengthBar(strength, 'Overall Strength')}
      <div class="stat-row"><span>FIFA Ranking</span><span class="stat-value">#${team.fifaRanking}</span></div>
      <div class="stat-row"><span>Goals / game</span><span class="stat-value">${team.goalsPerGame.toFixed(1)}</span></div>
      <div class="stat-row"><span>Conceded / game</span><span class="stat-value">${team.goalsAgainstPerGame.toFixed(1)}</span></div>
      <div class="stat-row"><span>Clean sheets (L10)</span><span class="stat-value">${team.cleanSheets}</span></div>
      <div class="stat-row"><span>Form points (L10)</span><span class="stat-value">${team.formPoints}/30</span></div>
      <div class="form-strip">${formStrip(team.form)}</div>
    </div>`;
}

export function predictionPanel(result, teamA, teamB) {
  const favTeam = result.favorite === teamA.id ? teamA
                : result.favorite === teamB.id ? teamB
                : null;
  const favoriteLabel = result.homeWinPct === result.awayWinPct || !favTeam
    ? t('drawLikely')
    : `${t('favourite')}: ${favTeam.flag} ${favTeam.name}`;

  function poissonProbs(lambda, upTo = 5) {
    const probs = [];
    let p = Math.exp(-lambda);
    probs.push(p);
    for (let k = 1; k <= upTo; k++) {
      p = p * lambda / k;
      probs.push(p);
    }
    return probs;
  }

  function poissonTable(xg, predictedGoals, teamName) {
    const probs = poissonProbs(xg);
    const cells = probs.map((p, k) => {
      const pct = (p * 100).toFixed(1);
      const isMode = k === predictedGoals;
      return `<td class="poisson-cell ${isMode ? 'poisson-mode' : ''}">${k}<br><span class="poisson-pct">${pct}%</span></td>`;
    }).join('');
    return `
      <div class="poisson-block">
        <div class="poisson-label">${teamName} · xG ${xg.toFixed(2)}</div>
        <table class="poisson-table"><tr>${cells}</tr></table>
      </div>`;
  }

  return `
    <div class="prediction-panel">
      <div class="prediction-score">
        <div class="score-display">${teamA.flag} ${result.predictedScore.home} : ${result.predictedScore.away} ${teamB.flag}</div>
        <div class="favorite-label">🏆 ${favoriteLabel}</div>
        <div class="xg-label">xG: ${result.xg.home} – ${result.xg.away}</div>
      </div>
      <div class="poisson-distribution">
        ${poissonTable(result.xg.home, result.predictedScore.home, teamA.flag + ' ' + teamA.name)}
        ${poissonTable(result.xg.away, result.predictedScore.away, teamB.flag + ' ' + teamB.name)}
      </div>
      <div class="prob-strip">
        <div class="prob-segment prob-home" style="flex:${result.homeWinPct}">${teamA.name} ${result.homeWinPct}%</div>
        <div class="prob-segment prob-draw" style="flex:${result.drawPct}">Draw ${result.drawPct}%</div>
        <div class="prob-segment prob-away" style="flex:${result.awayWinPct}">${teamB.name} ${result.awayWinPct}%</div>
      </div>
      <div class="team-stats-grid">
        ${teamStatCard(teamA, result.strengthA)}
        ${teamStatCard(teamB, result.strengthB)}
      </div>
    </div>`;
}

export function groupTable(group, teams, fixtures, results) {
  const groupTeams = teams.filter(t => t.group === group);
  const groupFixtures = fixtures.filter(f => f.group === group);

  const standing = {};
  groupTeams.forEach(t => {
    standing[t.id] = { id: t.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  });

  groupFixtures.forEach(f => {
    const r = results[f.id];
    if (!r) return;
    const h = standing[f.home];
    const a = standing[f.away];
    if (!h || !a) return;
    h.p++; a.p++;
    h.gf += r.home; h.ga += r.away;
    a.gf += r.away; a.ga += r.home;
    if (r.home > r.away) { h.w++; h.pts += 3; a.l++; }
    else if (r.home < r.away) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; h.pts++; a.d++; a.pts++; }
  });

  const sorted = Object.values(standing).sort((a, b) =>
    b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  );

  const teamById = Object.fromEntries(teams.map(t => [t.id, t]));

  const rows = sorted.map(s => {
    const t = teamById[s.id];
    return `
      <tr>
        <td><button class="team-name-btn" data-team="${t.id}">${t.flag} ${t.name}</button></td>
        <td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
        <td>${s.gf}</td><td>${s.ga}</td><td>${s.gf - s.ga}</td>
        <td class="pts">${s.pts}</td>
      </tr>`;
  }).join('');

  const fixtureRows = groupFixtures.map(f => {
    const r = results[f.id];
    const homeTeam = teamById[f.home];
    const awayTeam = teamById[f.away];
    const scoreHtml = r
      ? `<span class="fixture-score" data-match="${f.id}">${r.home}:${r.away}</span>`
      : `<span class="fixture-score pending" data-match="${f.id}">vs</span>`;
    return `
      <div class="fixture-row">
        <div class="fixture-teams">
          <span>${homeTeam ? homeTeam.flag + ' ' + homeTeam.name : f.home}</span>
          ${scoreHtml}
          <span>${awayTeam ? awayTeam.flag + ' ' + awayTeam.name : f.away}</span>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="group-card">
      <div class="group-title">Group ${group}</div>
      <table class="standings-table">
        <thead><tr>
          <th>${t('team')}</th><th>${t('played')}</th><th>${t('won')}</th><th>${t('drawn')}</th><th>${t('lost')}</th>
          <th>${t('goalsFor')}</th><th>${t('goalsAgainst')}</th><th>${t('goalDiff')}</th><th>${t('points')}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="fixtures-list">${fixtureRows}</div>
    </div>`;
}

export function teamProfileModal(team, strength, upcomingFixtures, allTeams) {
  const teamById = Object.fromEntries(allTeams.map(t => [t.id, t]));
  const fixtureRows = upcomingFixtures.map(f => {
    const opp = teamById[f.home === team.id ? f.away : f.home];
    const side = f.home === team.id ? t('home') : t('away');
    return `<div class="stat-row"><span>${opp ? opp.flag + ' ' + opp.name : ''}</span><span class="stat-value">${side} · ${f.date}</span></div>`;
  }).join('');

  return `
    <div class="modal-overlay" id="team-modal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">${team.flag} ${team.name}</div>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="profile-stat-section">
            <h3>${t('overall')}</h3>
            ${strengthBar(strength, t('strengthScore'))}
            <div class="stat-row"><span>${t('fifaRanking')}</span><span class="stat-value">#${team.fifaRanking}</span></div>
            <div class="stat-row"><span>${t('fifaPoints')}</span><span class="stat-value">${team.fifaPoints}</span></div>
            <div class="stat-row"><span>${t('wcAppearances')}</span><span class="stat-value">${team.worldCupAppearances}</span></div>
          </div>
          <div class="profile-stat-section">
            <h3>${t('attack')}</h3>
            <div class="stat-row"><span>${t('goalsScored')}</span><span class="stat-value">${team.goalsScored}</span></div>
            <div class="stat-row"><span>${t('goalsPerGame')}</span><span class="stat-value">${team.goalsPerGame.toFixed(1)}</span></div>
            <div class="stat-row"><span>${t('bigChances')}</span><span class="stat-value">${team.bigChancesCreated}</span></div>
          </div>
          <div class="profile-stat-section">
            <h3>${t('defence')}</h3>
            <div class="stat-row"><span>${t('goalsConceded')}</span><span class="stat-value">${team.goalsConceded}</span></div>
            <div class="stat-row"><span>${t('concededPerGame')}</span><span class="stat-value">${team.goalsAgainstPerGame.toFixed(1)}</span></div>
            <div class="stat-row"><span>${t('cleanSheets')}</span><span class="stat-value">${team.cleanSheets}</span></div>
          </div>
          <div class="profile-stat-section">
            <h3>${t('form')}</h3>
            <div class="stat-row"><span>${t('formPoints')}</span><span class="stat-value">${team.formPoints}/30</span></div>
            <div class="form-strip">${formStrip(team.form)}</div>
          </div>
          ${upcomingFixtures.length ? `<div class="profile-stat-section"><h3>${t('upcoming')}</h3>${fixtureRows}</div>` : ''}
        </div>
      </div>
    </div>`;
}
