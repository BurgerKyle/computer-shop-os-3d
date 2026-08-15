// Admin Console & Kuya Ricky Support Station Hub

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

      if (!isUnlocked) {
        // Admin PIN lock screen
        container.innerHTML = `
          <div class="hub-header">
            <div class="hub-badge-icon">🔐</div>
            <div>
              <div class="hub-title">Kuya Ricky & Admin Console</div>
              <div class="hub-subtitle">Enter admin password (Default: <code>admin1234</code>) or message Kuya Ricky.</div>
            </div>
          </div>

          <div style="max-width: 400px; margin: 20px auto; text-align: center;">
            <label class="form-label" style="text-align: center;">Admin Password</label>
            <input type="password" id="adminUnlockPin" class="form-input" placeholder="Password" style="text-align: center; font-size: 18px;" />
            <div id="adminPinError" class="form-error" hidden>Incorrect password.</div>
            <div class="form-actions" style="margin-top: 18px;">
              <button type="button" class="btn btn-primary" id="submitAdminUnlockBtn">Unlock Admin Console</button>
            </div>
          </div>
        `;

        const pinInput = document.getElementById('adminUnlockPin');
        const submitBtn = document.getElementById('submitAdminUnlockBtn');
        const errorEl = document.getElementById('adminPinError');

        const doUnlock = () => {
          if (pinInput.value === 'admin1234') {
            if (soundFX) soundFX.playScore();
            isUnlocked = true;
            render();
          } else {
            errorEl.hidden = false;
          }
        };

        submitBtn.addEventListener('click', doUnlock);
        pinInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doUnlock();
        });
        pinInput.focus();
        return;
      }

      // Unlocked Admin Console
      container.innerHTML = `
        <div class="hub-header">
          <div class="hub-badge-icon">🛡️</div>
          <div>
            <div class="hub-title">Computer Shop Admin Console</div>
            <div class="hub-subtitle">Terminal unlocked. Manage pilots, grant bonus time, and message Kuya Ricky.</div>
          </div>
        </div>

        <div class="admin-tabs">
          <button type="button" class="admin-tab-btn ${activeTab === 'chat' ? 'active' : ''}" data-tab="chat">💬 Kuya Ricky Chat</button>
          <button type="button" class="admin-tab-btn ${activeTab === 'playtime' ? 'active' : ''}" data-tab="playtime">⏱️ Playtime Grants</button>
          <button type="button" class="admin-tab-btn ${activeTab === 'accounts' ? 'active' : ''}" data-tab="accounts">🧑‍🚀 Pilots & Ages</button>
          <button type="button" class="admin-tab-btn ${activeTab === 'terminal' ? 'active' : ''}" data-tab="terminal">💻 Terminal Info</button>
        </div>

        <div id="adminTabContent"></div>
      `;

      modal.classList.add('active');

      container.querySelectorAll('.admin-tab-btn').forEach(btn => {
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
        <div class="chat-box" id="adminChatMessages">
          <div class="chat-msg admin">
            <strong>Kuya Ricky:</strong> Hello gamers! Welcome to the 3D Sky Island. Let me know if you need help with Roblox, Minecraft, or extra playtime!
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="chatInput" class="form-input" placeholder="Type a message to Kuya Ricky..." autocomplete="off" />
          <button type="button" class="btn btn-primary" id="sendChatBtn" style="flex: 0 0 100px;">Send</button>
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
        userMsg.innerHTML = `<strong>You:</strong> ${text}`;
        chatBox.appendChild(userMsg);
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Auto reply
        setTimeout(() => {
          if (soundFX) soundFX.playScore();
          const replies = [
            "Got it! Enjoy your time on the sky island!",
            "I'm keeping the Minecraft server updated. Have fun building!",
            "Good job on Space Typing! Practice makes perfect!",
            "Need more playtime? Just ask or complete typing missions!"
          ];
          const reply = replies[Math.floor(Math.random() * replies.length)];
          const adminMsg = document.createElement('div');
          adminMsg.className = 'chat-msg admin';
          adminMsg.innerHTML = `<strong>Kuya Ricky:</strong> ${reply}`;
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
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 18px; margin-bottom: 12px;">⚡ Grant Bonus Playtime</h3>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
            Current Active Pilot: <strong>${pilot ? pilot.name : 'None logged in'}</strong> 
            (${pilot ? Math.floor(pilot.remainingSeconds / 60) + ' min remaining' : ''})
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button type="button" class="btn btn-primary" id="grant15Btn" style="background: #10b981;">+ 15 Minutes</button>
            <button type="button" class="btn btn-primary" id="grant30Btn" style="background: #06b6d4;">+ 30 Minutes</button>
            <button type="button" class="btn btn-primary" id="grant60Btn" style="background: #8b5cf6;">+ 1 Hour</button>
          </div>
        </div>
      `;

      if (pilot) {
        document.getElementById('grant15Btn').addEventListener('click', () => {
          accountsStore.grantBonusMinutes(pilot.id, 15);
          if (soundFX) soundFX.playScore();
          alert(`Granted 15 bonus minutes to ${pilot.name}!`);
          render();
        });
        document.getElementById('grant30Btn').addEventListener('click', () => {
          accountsStore.grantBonusMinutes(pilot.id, 30);
          if (soundFX) soundFX.playScore();
          alert(`Granted 30 bonus minutes to ${pilot.name}!`);
          render();
        });
        document.getElementById('grant60Btn').addEventListener('click', () => {
          accountsStore.grantBonusMinutes(pilot.id, 60);
          if (soundFX) soundFX.playScore();
          alert(`Granted 60 bonus minutes to ${pilot.name}!`);
          render();
        });
      }
    }

    function renderAccounts(parent) {
      const accounts = accountsStore.listAccounts();
      parent.innerHTML = `
        <div style="max-height: 380px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-glass); text-align: left; color: var(--text-muted);">
                <th style="padding: 10px;">Name</th>
                <th style="padding: 10px;">Age</th>
                <th style="padding: 10px;">Age Group</th>
                <th style="padding: 10px;">PIN</th>
                <th style="padding: 10px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${accounts.map(a => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 10px; font-weight: 700;">${a.name}</td>
                  <td style="padding: 10px;">${a.age || 10}</td>
                  <td style="padding: 10px;"><span class="age-badge ${a.ageGroup}">${a.ageGroup}</span></td>
                  <td style="padding: 10px; font-family: monospace;">${a.pin}</td>
                  <td style="padding: 10px;">
                    <button type="button" class="btn btn-ghost toggle-age-btn" data-id="${a.id}" style="padding: 4px 10px; font-size: 11px;">
                      Switch to ${a.ageGroup === 'child' ? 'Teen (14)' : 'Child (9)'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      parent.querySelectorAll('.toggle-age-btn').forEach(btn => {
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
        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 18px; margin-bottom: 16px;">💻 Terminal & Network Diagnostics</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 14px;">
            <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 8px;">
              <span style="color: var(--text-muted); display: block; font-size: 11px;">TERMINAL NAME</span>
              <strong>KIOSK-COMPUTER-01</strong>
            </div>
            <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 8px;">
              <span style="color: var(--text-muted); display: block; font-size: 11px;">LAN IP ADDRESS</span>
              <strong>192.168.1.100</strong>
            </div>
            <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 8px;">
              <span style="color: var(--text-muted); display: block; font-size: 11px;">SCREEN MONITORING</span>
              <strong style="color: #34d399;">Active (Streaming)</strong>
            </div>
            <div style="background: rgba(15,23,42,0.8); padding: 12px; border-radius: 8px;">
              <span style="color: var(--text-muted); display: block; font-size: 11px;">3D ENGINE</span>
              <strong style="color: #38bdf8;">Three.js WebGL Sky Island</strong>
            </div>
          </div>
        </div>
      `;
    }

    render();
  }
}
