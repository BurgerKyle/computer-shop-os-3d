// Weekly Hall of Fame & Leaderboard Hub

export class LeaderboardHub {
  static open(accountsStore, soundFX = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    const leaderboard = accountsStore.getLeaderboard();
    const currentPilot = accountsStore.currentPilot;

    function fmtTime(sec) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    }

    const medals = ['🥇', '🥈', '🥉'];

    container.className = 'hub-body leaderboard-theme';
    container.innerHTML = `
      <div class="hub-header">
        <div class="hub-badge-icon">🏆</div>
        <div>
          <div class="hub-title">Hall of Fame • Top Gamers</div>
          <div class="hub-subtitle">Weekly playtime and arcade champions on the Computer Shop OS!</div>
        </div>
      </div>

      <div class="leaderboard-table">
        ${leaderboard.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); padding: 40px;">
            No playtime recorded yet this week! Be the first on the board.
          </div>
        ` : leaderboard.map((row, i) => `
          <div class="leaderboard-row ${currentPilot && currentPilot.id === row.id ? 'me' : ''}">
            <div class="rank-badge">${medals[i] || `#${i + 1}`}</div>
            <div class="gamer-name">
              ${row.name}
              <span class="age-badge ${row.ageGroup}" style="margin-left: 8px;">${row.ageGroup}</span>
            </div>
            <div class="gamer-time">⏱️ ${fmtTime(row.weeklySeconds || 0)} played</div>
          </div>
        `).join('')}
      </div>
    `;

    modal.classList.add('active');
  }
}
