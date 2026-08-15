// Age-Aware YouTube Hub (YouTube Kids for Children < 13 vs Regular YouTube for Teens 13+)

export class YouTubeHub {
  static open(account, soundFX = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    const isTeen = (account.age || 10) >= 13;

    container.className = 'hub-body youtube-theme';

    if (isTeen) {
      // ---------------- TEEN: REGULAR YOUTUBE ----------------
      container.innerHTML = `
        <div class="hub-header">
          <div class="hub-badge-icon" style="background: linear-gradient(135deg, #ef4444, #b91c1c);">▶️</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="hub-title">YouTube</div>
              <span class="age-badge teen">Teen Mode (Age ${account.age || 14})</span>
            </div>
            <div class="hub-subtitle">Full YouTube access for gaming videos, music, tech & tutorials.</div>
          </div>
          <a href="https://www.youtube.com" target="_blank" class="btn btn-primary" style="background: #ef4444; text-decoration: none;">
            Open YouTube.com ↗
          </a>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <input type="text" id="ytSearchInput" class="form-input" placeholder="Search YouTube gaming, music, tutorials..." style="background: rgba(15,23,42,0.9);" />
          <button type="button" class="btn btn-primary" id="ytSearchBtn" style="flex: 0 0 100px; background: #ef4444;">Search</button>
        </div>

        <h3 style="font-size: 15px; margin-bottom: 14px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">
          🔥 Recommended For You
        </h3>

        <div class="videos-grid">
          <div class="video-card" data-video="https://www.youtube.com/results?search_query=roblox+pro+tips">
            <div class="video-thumb" style="background: linear-gradient(135deg, #1e293b, #0f172a);">
              <span style="font-size: 38px;">🎮</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">Top 10 Secret Mechanics in Roblox BedWars</div>
              <div class="video-channel">Gaming Hub Pro • 420K views</div>
            </div>
          </div>

          <div class="video-card" data-video="https://www.youtube.com/results?search_query=minecraft+hardcore+survival">
            <div class="video-thumb" style="background: linear-gradient(135deg, #15803d, #0f172a);">
              <span style="font-size: 38px;">⛏️</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">100 Days in Minecraft Hardcore Survival</div>
              <div class="video-channel">Block Master • 1.2M views</div>
            </div>
          </div>

          <div class="video-card" data-video="https://www.youtube.com/results?search_query=three+js+game+development">
            <div class="video-thumb" style="background: linear-gradient(135deg, #6366f1, #0f172a);">
              <span style="font-size: 38px;">💻</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">How I Built a 3D Sky Island Game in Three.js</div>
              <div class="video-channel">Dev Code Lab • 280K views</div>
            </div>
          </div>

          <div class="video-card" data-video="https://www.youtube.com/results?search_query=lofi+hip+hop+radio">
            <div class="video-thumb" style="background: linear-gradient(135deg, #8b5cf6, #0f172a);">
              <span style="font-size: 38px;">🎧</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">Lofi Hip Hop Radio - Beats to Game/Relax to</div>
              <div class="video-channel">Chillhop Music • Live</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // ---------------- CHILD: YOUTUBE KIDS ----------------
      container.innerHTML = `
        <div class="hub-header">
          <div class="hub-badge-icon" style="background: linear-gradient(135deg, #ff0000, #f59e0b);">👶</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="hub-title">YouTube Kids</div>
              <span class="age-badge child">Kid Mode (Age ${account.age || 9})</span>
            </div>
            <div class="hub-subtitle">Safe, fun, and curated videos for children. Whitelisted and verified!</div>
          </div>
          <a href="https://www.youtubekids.com" target="_blank" class="btn btn-primary" style="background: #ff0000; text-decoration: none;">
            Open YouTube Kids ↗
          </a>
        </div>

        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 12px 18px; margin-bottom: 20px; font-size: 13px; color: #34d399; display: flex; align-items: center; gap: 10px;">
          <span>🛡️</span>
          <span><strong>Safe Protection Active:</strong> Only approved children's channels and educational content are accessible.</span>
        </div>

        <h3 style="font-size: 15px; margin-bottom: 14px; color: var(--text-muted); font-weight: 800; text-transform: uppercase;">
          ⭐ Curated Kids Channels
        </h3>

        <div class="videos-grid">
          <div class="video-card" data-video="https://www.youtubekids.com">
            <div class="video-thumb" style="background: linear-gradient(135deg, #0284c7, #0f172a);">
              <span style="font-size: 38px;">🦁</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">National Geographic Kids: Animal Explorers</div>
              <div class="video-channel">Nat Geo Kids • Safe for all ages</div>
            </div>
          </div>

          <div class="video-card" data-video="https://www.youtubekids.com">
            <div class="video-thumb" style="background: linear-gradient(135deg, #10b981, #0f172a);">
              <span style="font-size: 38px;">🔬</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">SciShow Kids: Why Do Volcanoes Erupt?</div>
              <div class="video-channel">SciShow Kids • Science & Fun</div>
            </div>
          </div>

          <div class="video-card" data-video="https://www.youtubekids.com">
            <div class="video-thumb" style="background: linear-gradient(135deg, #ec4899, #0f172a);">
              <span style="font-size: 38px;">🎨</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">Art for Kids Hub: How to Draw a Cute Dragon</div>
              <div class="video-channel">Art for Kids • Creative Arts</div>
            </div>
          </div>

          <div class="video-card" data-video="https://www.youtubekids.com">
            <div class="video-thumb" style="background: linear-gradient(135deg, #f59e0b, #0f172a);">
              <span style="font-size: 38px;">🧘</span>
              <div class="play-icon-overlay">▶</div>
            </div>
            <div class="video-details">
              <div class="video-title">Cosmic Kids Yoga: Space Adventure Episode</div>
              <div class="video-channel">Cosmic Kids • Movement & Joy</div>
            </div>
          </div>
        </div>
      `;
    }

    modal.classList.add('active');

    // Video card clicks
    container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        if (soundFX) soundFX.playClick();
        const url = card.dataset.video;
        window.open(url, '_blank');
      });
    });

    const searchBtn = document.getElementById('ytSearchBtn');
    const searchInput = document.getElementById('ytSearchInput');
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => {
        const query = encodeURIComponent(searchInput.value.trim());
        if (query) {
          if (soundFX) soundFX.playClick();
          window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        }
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchBtn.click();
      });
    }
  }
}
