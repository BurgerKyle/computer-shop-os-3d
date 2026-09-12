// Admin Console & Kuya Ricky Support Station Hub
import { escapeHtml } from '../util/dom.js';

export class AdminHub {
  static open(accountsStore, soundFX = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    let isUnlocked = false;
    let activeTab = 'chat'; // 'chat' | 'playtime' | 'accounts' | 'terminal'

    function render() {
      container.className = 'hub-body admin-theme';
      modal.classList.add('active');

      if (!isUnlocked) {
        container.innerHTML = `
          <div class="hub-header">
            <div class="hub-badge-icon" aria-hidden="true">🔐</div>
            <div>
              <div class="hub-title">Kuya Ricky & Admin Console</div>
              <div class="hub-subtitle">Enter the admin password to manage pilots, or leave a message for Kuya Ricky.</div>
            </div>
          </div>

          <div class="admin-unlock-panel">
            <label class="form-label" for="adminUnlockPin">Admin Password</label>
            <input type="password" id="adminUnlockPin" class="form-input" placeholder="Password" autocomplete="current-password" aria-describedby="adminPinError" />
            <div id="adminPinError" class="form-error" role="alert" hidden>Incorrect password.</div>
            <div class="form-actions" style="margin-top: 18px;">
              <button type="button" class="btn btn-primary" id="submitAdminUnlockBtn">Unlock Admin Console</button>
            </div>
          </div>
        `;

        const pinInput = document.getElementById('adminUnlockPin');
        const submitBtn = document.getElementById('submitAdminUnlockBtn');
        const errorEl = document.getElementById('adminPinError');

        const doUnlock = async () => {
          submitBtn.disabled = true;
          const result = await accountsStore.verifyAdminPassword(pinInput.value.trim());
          submitBtn.disabled = false;
          if (result.ok) {
            if (soundFX) soundFX.playScore();
            isUnlocked = true;
            render();
          } else {
            errorEl.hidden = false;
            pinInput.focus();
          }
        };

        submitBtn.addEventListener('click', doUnlock);
        pinInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doUnlock();
        });
        pinInput.focus();
        return;
      }

      container.innerHTML = `
        <div class="hub-header">
          <div class="hub-badge-icon" aria-hidden="true">🛡️</div>
          <div>
            <div class="hub-title">Computer Shop Admin Console</div>
            <div class="hub-subtitle">Terminal unlocked. Manage pilots, grant bonus time, and message Kuya Ricky.</div>
          </div>
        </div>

        <div class="admin-tabs" role="tablist" aria-label="Admin sections">
          <button type="button" role="tab" class="admin-tab-btn ${activeTab === 'chat' ? 'active' : ''}" data-tab="chat" aria-selected="${activeTab === 'chat'}">💬 Kuya Ricky Chat</button>
          <button type="button" role="tab" class="admin-tab-btn ${activeTab === 'playtime' ? 'active' : ''}" data-tab="playtime" aria-selected="${activeTab === 'playtime'}">⏱️ Playtime Grants</button>
          <button type="button" role="tab" class="admin-tab-btn ${activeTab === 'accounts' ? 'active' : ''}" data-tab="accounts" aria-selected="${activeTab === 'accounts'}">🧑‍🚀 Pilots & Ages</button>
          <button type="button" role="tab" class="admin-tab-btn ${activeTab === 'terminal' ? 'active' : ''}" data-tab="terminal" aria-selected="${activeTab === 'terminal'}">💻 Terminal Info</button>
        </div>

        <div id="adminTabContent" role="tabpanel"></div>
      `;

      container.querySelectorAll('.admin-tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (soundFX) soundFX.playClick();
          activeTab = btn.dataset.tab;
          render();
        });
      });

      const tabContent = document.getElementById('adminTabContent');

      if (activeTab === 'chat') {
        renderChat(tabContent);
      } else if (activeTab === 'playtime') {
        renderPlaytime(tabContent);
      } else if (activeTab === 'accounts') {
        renderAccounts(tabContent);
      } else if (activeTab === 'terminal') {
        renderTerminal(tabContent);
      }
    }

    function renderChat(parent) {
      parent.innerHTML = `
        <div class="chat-box" id="adminChatMessages" aria-live="polite">
          <div class="chat-msg admin">
            <strong>Kuya Ricky:</strong> Hello gamers! Welcome to the 3D Sky Island. Let me know if you need help with Roblox, Minecraft, or extra playtime!
          </div>
        </div>
        <div class="chat-compose">
          <input type="text" id="chatInput" class="form-input" placeholder="Type a message to Kuya Ricky..." autocomplete="off" maxlength="280" aria-label="Message to Kuya Ricky" />
          <button type="button" class="btn btn-primary" id="sendChatBtn">Send</button>
        </div>
      `;

      const chatBox = document.getElementById('adminChatMessages');
      const input = document.getElementById('chatInput');
      const sendBtn = document.getElementById('sendChatBtn');

      const send = () => {
        const text = input.value.trim();
        if (!text) return;
        if (soundFX) soundFX.playClick();

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        const userStrong = document.createElement('strong');
        userStrong.textContent = 'You:';
        userMsg.appendChild(userStrong);
        userMsg.appendChild(document.createTextNode(' ' + text));
        chatBox.appendChild(userMsg);
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
          if (soundFX) soundFX.playScore();
          const replies = [
            'Got it! Enjoy your time on the sky island!',
            "I'm keeping the Minecraft server updated. Have fun building!",
            'Good job on Space Typing! Practice makes perfect!',
            'Need more playtime? Just ask or complete typing missions!'
          ];
          const reply = replies[Math.floor(Math.random() * replies.length)];
          const adminMsg = document.createElement('div');
          adminMsg.className = 'chat-msg admin';
          const adminStrong = document.createElement('strong');
          adminStrong.textContent = 'Kuya Ricky:';
          adminMsg.appendChild(adminStrong);
          adminMsg.appendChild(document.createTextNode(' ' + reply));
          chatBox.appendChild(adminMsg);
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 800);
      };

      sendBtn.addEventListener('click', send);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') send();
      });
      input.focus();
    }

    function renderPlaytime(parent) {
      const pilot = accountsStore.currentPilot;
      parent.innerHTML = `
        <div class="admin-panel-card">
          <h3>⚡ Grant Bonus Playtime</h3>
          <p class="admin-panel-copy">
            Current Active Pilot: <strong>${escapeHtml(pilot ? pilot.name : 'None logged in')}</strong>
            (${pilot ? Math.floor(pilot.remainingSeconds / 60) + ' min remaining' : '—'})
          </p>
          <div class="admin-grant-row">
            <button type="button" class="btn btn-primary grant-btn" data-mins="15" ${pilot ? '' : 'disabled'}>+ 15 Minutes</button>
            <button type="button" class="btn btn-primary grant-btn cyan" data-mins="30" ${pilot ? '' : 'disabled'}>+ 30 Minutes</button>
            <button type="button" class="btn btn-primary grant-btn violet" data-mins="60" ${pilot ? '' : 'disabled'}>+ 1 Hour</button>
          </div>
        </div>
      `;

      parent.querySelectorAll('.grant-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!pilot) return;
          const mins = Number(btn.dataset.mins);
          btn.disabled = true;
          const result = await accountsStore.grantBonusMinutes(pilot.id, mins);
          btn.disabled = false;
          if (result.ok) {
            if (soundFX) soundFX.playScore();
            render();
          } else {
            alert(result.error || 'Grant failed — unlock admin again.');
          }
        });
      });
    }

    function renderAccounts(parent) {
      const accounts = accountsStore.listAccounts();
      parent.innerHTML = `
        <div class="admin-accounts-scroll">
          <table class="admin-accounts-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Age Group</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${accounts.map((a) => `
                <tr>
                  <td class="name-cell">${escapeHtml(a.name)}</td>
                  <td>${a.age || 10}</td>
                  <td><span class="age-badge ${escapeHtml(a.ageGroup)}">${escapeHtml(a.ageGroup)}</span></td>
                  <td>
                    <button type="button" class="btn btn-ghost toggle-age-btn" data-id="${a.id}">
                      Switch to ${a.ageGroup === 'child' ? 'Teen (14)' : 'Child (9)'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      parent.querySelectorAll('.toggle-age-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = Number(btn.dataset.id);
          const acct = accountsStore.getAccountById(id);
          if (acct) {
            const newAge = acct.ageGroup === 'child' ? 14 : 9;
            accountsStore.updateAge(id, newAge);
            if (soundFX) soundFX.playScore();
            render();
          }
        });
      });
    }

    function renderTerminal(parent) {
      parent.innerHTML = `
        <div class="admin-panel-card">
          <h3>💻 Terminal & Network Diagnostics</h3>
          <div class="admin-diag-grid">
            <div class="admin-diag-cell">
              <span class="diag-label">TERMINAL NAME</span>
              <strong id="adminTerminalName">KIOSK-01</strong>
            </div>
            <div class="admin-diag-cell">
              <span class="diag-label">ENGINE</span>
              <strong class="ok-cyan">Three.js WebGL Sky Island</strong>
            </div>
            <div class="admin-diag-cell">
              <span class="diag-label">API</span>
              <strong class="ok-green" id="adminApiStatus">Checking…</strong>
            </div>
            <div class="admin-diag-cell">
              <span class="diag-label">VERSION</span>
              <strong id="adminVersion">—</strong>
            </div>
          </div>
        </div>
      `;

      fetch('/api/health')
        .then((r) => r.json())
        .then((data) => {
          const nameEl = document.getElementById('adminTerminalName');
          const statusEl = document.getElementById('adminApiStatus');
          const verEl = document.getElementById('adminVersion');
          if (nameEl) nameEl.textContent = data.terminalName || 'KIOSK-01';
          if (statusEl) statusEl.textContent = data.ok ? 'Healthy' : 'Degraded';
          if (verEl) verEl.textContent = data.version || '—';
        })
        .catch(() => {
          const statusEl = document.getElementById('adminApiStatus');
          if (statusEl) {
            statusEl.textContent = 'Offline';
            statusEl.className = 'ok-rose';
          }
        });
    }

    render();
  }
}
