// Minecraft Hub Modal Controller (Direct 1-Click Native Launcher)

export class MinecraftHub {
  static open(account, soundFX = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    container.className = 'hub-body minecraft-theme';
    container.innerHTML = `
      <div class="hub-header">
        <div class="hub-badge-icon">⛏️</div>
        <div>
          <div class="hub-title">Minecraft Bedrock Station</div>
          <div class="hub-subtitle">Launch Minecraft Bedrock & connect to the local Cotmon Server!</div>
        </div>
      </div>

      <div class="server-card">
        <div>
          <div style="font-weight: 800; font-size: 18px; margin-bottom: 4px;">
            <span class="server-status-dot"></span> Cotmon Minecraft Server
          </div>
          <div style="font-size: 13px; color: var(--text-muted);">
            Dedicated Bedrock Multiplayer LAN Server • Port: 19132
          </div>
        </div>
        <button type="button" class="btn btn-primary" id="joinCotmonServerBtn" style="background: #16a34a;">
          Connect & Play
        </button>
      </div>

      <div class="launcher-banner" style="background: rgba(109, 159, 63, 0.15); border-color: #6d9f3f;">
        <div>
          <h3 style="font-size: 18px; margin-bottom: 4px;">⛏️ Minecraft Bedrock Edition</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Launch the full Microsoft Store Minecraft app on this computer.</p>
        </div>
        <button type="button" class="launcher-btn" id="launchMinecraftBtn" style="background: #15803d;">
          Launch Minecraft
        </button>
      </div>

      <div style="margin-top: 24px; background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 20px;">
        <h4 style="font-size: 15px; margin-bottom: 8px;">🎮 Minecraft Tips & Quick Server Setup:</h4>
        <ul style="font-size: 13px; color: var(--text-muted); line-height: 1.6; padding-left: 20px;">
          <li>In Minecraft, go to <strong>Play &gt; Servers &gt; Add Server</strong></li>
          <li>Server Name: <code>Cotmon Server</code></li>
          <li>Server Address: <code>192.168.1.100</code> (or local broadcast)</li>
          <li>Port: <code>19132</code></li>
        </ul>
      </div>
    `;

    modal.classList.add('active');

    const launchBtn = document.getElementById('launchMinecraftBtn');
    const joinBtn = document.getElementById('joinCotmonServerBtn');

    const doLaunch = async () => {
      if (soundFX) soundFX.playScore();
      if (launchBtn) {
        launchBtn.textContent = '⛏️ Launching...';
        launchBtn.disabled = true;
      }

      try {
        if (window.kioskAPI && window.kioskAPI.launchMinecraft) {
          await window.kioskAPI.launchMinecraft();
        } else {
          await fetch('/api/launch/minecraft', { method: 'POST' });
        }
      } catch (e) {
        window.location.href = 'minecraft://';
      }

      if (launchBtn) {
        launchBtn.textContent = '🎮 Minecraft is Running!';
        setTimeout(() => {
          if (launchBtn) {
            launchBtn.textContent = 'Launch Minecraft';
            launchBtn.disabled = false;
          }
        }, 4000);
      }
    };

    launchBtn.addEventListener('click', doLaunch);
    joinBtn.addEventListener('click', doLaunch);
  }
}
