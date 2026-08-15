// Web Explorer Hub (Safe Search Whitelist Simulator)

export class WebExplorerHub {
  static open(account, soundFX = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    const isTeen = (account.age || 10) >= 13;

    container.className = 'hub-body web-theme';
    container.innerHTML = `
      <div class="hub-header">
        <div class="hub-badge-icon">🌐</div>
        <div>
          <div class="hub-title">Web Explorer & Learning Portal</div>
          <div class="hub-subtitle">Safe, educational web resources whitelisted for this terminal.</div>
        </div>
      </div>

      <div class="browser-toolbar">
        <div class="browser-address-bar">
          <span>🔒</span>
          <span id="currentWebUrl">https://www.kiddle.co</span>
        </div>
        <button type="button" class="btn btn-ghost" id="openExternalWebBtn" style="flex: 0 0 140px; padding: 6px 12px; font-size: 12px;">
          Open in Tab ↗
        </button>
      </div>

      <div class="browser-bookmarks">
        <button type="button" class="bookmark-btn" data-url="https://www.kiddle.co">
          🔍 Kiddle Safe Search
        </button>
        <button type="button" class="bookmark-btn" data-url="https://kids.nationalgeographic.com">
          🦁 Nat Geo Kids
        </button>
        <button type="button" class="bookmark-btn" data-url="https://earth.google.com/web/">
          🌍 Google Earth 3D
        </button>
        ${isTeen ? `
        <button type="button" class="bookmark-btn" data-url="https://www.wikipedia.org">
          📚 Wikipedia
        </button>
        <button type="button" class="bookmark-btn" data-url="https://scratch.mit.edu">
          🐱 Scratch MIT
        </button>
        ` : ''}
      </div>

      <iframe id="webExplorerIframe" class="browser-viewport" src="https://www.kiddle.co" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
    `;

    modal.classList.add('active');

    const iframe = document.getElementById('webExplorerIframe');
    const urlSpan = document.getElementById('currentWebUrl');
    const extBtn = document.getElementById('openExternalWebBtn');

    let activeUrl = 'https://www.kiddle.co';

    container.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (soundFX) soundFX.playClick();
        activeUrl = btn.dataset.url;
        urlSpan.textContent = activeUrl;
        iframe.src = activeUrl;
      });
    });

    extBtn.addEventListener('click', () => {
      if (soundFX) soundFX.playClick();
      window.open(activeUrl, '_blank');
    });
  }
}
