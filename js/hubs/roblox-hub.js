// Roblox Hub Modal Controller (Direct 1-Click Native Launcher)

export class RobloxHub {
  static open(account, soundFX = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    container.className = 'hub-body roblox-theme';
    container.innerHTML = `
      <div class="hub-header">
        <div class="hub-badge-icon">🎮</div>
        <div>
          <div class="hub-title">Roblox Gaming Portal</div>
          <div class="hub-subtitle">Choose a game to launch directly or open the Roblox app!</div>
        </div>
      </div>

      <div class="launcher-banner">
        <div>
          <h3 style="font-size: 18px; margin-bottom: 4px;">🚀 Launch Roblox Player</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Boots the official Roblox client on your terminal directly.</p>
        </div>
        <button type="button" class="launcher-btn" id="launchRobloxAppBtn">Play Roblox Now</button>
      </div>

      <h3 style="font-size: 16px; margin: 24px 0 14px; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
        🔥 Popular Games
      </h3>

      <div class="games-grid">
        <div class="game-card" data-place="blox-fruits">
          <div class="game-thumb" style="background: linear-gradient(135deg, #1e3a8a, #0f172a);">
            ⚔️
            <span class="game-players-badge">520K Playing</span>
          </div>
          <div class="game-info">
            <div class="game-name">Blox Fruits</div>
            <div class="game-genre">Anime / Adventure</div>
          </div>
        </div>

        <div class="game-card" data-place="adopt-me">
          <div class="game-thumb" style="background: linear-gradient(135deg, #047857, #0f172a);">
            🐶
            <span class="game-players-badge">180K Playing</span>
          </div>
          <div class="game-info">
            <div class="game-name">Adopt Me!</div>
            <div class="game-genre">Roleplay / Pets</div>
          </div>
        </div>

        <div class="game-card" data-place="brookhaven">
          <div class="game-thumb" style="background: linear-gradient(135deg, #b45309, #0f172a);">
            🏡
            <span class="game-players-badge">430K Playing</span>
          </div>
          <div class="game-info">
            <div class="game-name">Brookhaven 🏡RP</div>
            <div class="game-genre">Town & City</div>
          </div>
        </div>

        <div class="game-card" data-place="bedwars">
          <div class="game-thumb" style="background: linear-gradient(135deg, #6d28d9, #0f172a);">
            🛡️
            <span class="game-players-badge">95K Playing</span>
          </div>
          <div class="game-info">
            <div class="game-name">BedWars</div>
            <div class="game-genre">Action / Strategy</div>
          </div>
        </div>

        <div class="game-card" data-place="tower-of-hell">
          <div class="game-thumb" style="background: linear-gradient(135deg, #be185d, #0f172a);">
            🗼
            <span class="game-players-badge">85K Playing</span>
          </div>
          <div class="game-info">
            <div class="game-name">Tower of Hell</div>
            <div class="game-genre">Obby / Parkour</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    const launchBtn = document.getElementById('launchRobloxAppBtn');

    const doLaunch = async (gameName = null) => {
      if (soundFX) soundFX.playScore();
      if (launchBtn) {
        launchBtn.textContent = '🚀 Launching...';
        launchBtn.disabled = true;
      }

      try {
        if (window.kioskAPI && window.kioskAPI.launchRoblox) {
          await window.kioskAPI.launchRoblox();
        } else {
          // Native backend spawn (bypasses Chrome popups completely!)
          await fetch('/api/launch/roblox', { method: 'POST' });
        }
      } catch (e) {
        // Protocol fallback
        window.location.href = 'roblox://';
      }

      if (launchBtn) {
        launchBtn.textContent = gameName ? `🎮 Launching ${gameName}!` : '🎮 Roblox is Running!';
        setTimeout(() => {
          if (launchBtn) {
            launchBtn.textContent = 'Play Roblox Now';
            launchBtn.disabled = false;
          }
        }, 4000);
      }
    };

    launchBtn.addEventListener('click', () => doLaunch());

    container.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const game = card.querySelector('.game-name').textContent;
        doLaunch(game);
      });
    });
  }
}
