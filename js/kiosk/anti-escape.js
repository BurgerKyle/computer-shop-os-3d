// In-Browser / Web-Tier Anti-Escape Lockdown & Admin Escape Gate

export class KioskAntiEscape {
  constructor(soundFX = null) {
    this.soundFX = soundFX;
    this.adminPassword = 'admin1234';
    this._initLockdown();
    this._initSecretAdminCombo();
    this._injectAdminEscapeModal();
  }

  _initLockdown() {
    // 1. Block Context Menu
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // 2. Prevent Drag & Drop out of window
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => e.preventDefault());

    // 3. Block Navigation Keys & DevTools shortcuts
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      // Check if Admin Escape hotkey: Ctrl + Alt + Shift + A OR Ctrl + Alt + A
      if (ctrl && alt && (key === 'a' || e.code === 'KeyA')) {
        e.preventDefault();
        this.openAdminEscapeDialog();
        return;
      }

      // Block F-keys & common browser escape combinations
      if (
        key === 'f5' ||
        key === 'f11' ||
        key === 'f12' ||
        key === 'f1' ||
        key === 'f3' ||
        (alt && (key === 'f4' || e.code === 'F4')) ||
        (ctrl && ['r', 'w', 'q', 'p', 's', 'n', 't', 'u', 'h', 'j'].includes(key)) ||
        (ctrl && shift && ['i', 'j', 'c', 'r', 'delete'].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);

    // 4. Request Fullscreen on First Click if not in Electron kiosk
    const enforceFullscreen = () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    window.addEventListener('click', enforceFullscreen, { once: true });
  }

  _initSecretAdminCombo() {
    // Double tap top-right corner to open Admin Exit dialog
    let cornerTaps = 0;
    let tapTimer = null;

    window.addEventListener('click', (e) => {
      if (e.clientX > window.innerWidth - 80 && e.clientY < 80) {
        cornerTaps++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { cornerTaps = 0; }, 1500);

        if (cornerTaps >= 4) {
          cornerTaps = 0;
          this.openAdminEscapeDialog();
        }
      }
    });
  }

  _injectAdminEscapeModal() {
    if (document.getElementById('adminEscapeModal')) return;

    const modal = document.createElement('div');
    modal.id = 'adminEscapeModal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-window" style="max-width: 520px; text-align: center;">
        <button class="modal-close-btn" id="closeAdminEscapeBtn">✕</button>
        <div style="font-size: 38px; margin-bottom: 8px;">🔐</div>
        <h2 style="font-family: var(--font-display); font-size: 26px; font-weight: 800; margin-bottom: 8px;">Admin Kiosk Gate</h2>
        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 24px;">Enter the Master Kiosk Password to exit kiosk mode or service the terminal.</p>
        
        <div class="form-group">
          <label class="form-label">Master Admin Password</label>
          <input type="password" id="adminEscapePasswordInput" class="form-input" placeholder="••••••••" style="text-align: center; font-size: 20px;" autocomplete="off" />
        </div>

        <div id="adminEscapeError" class="form-error" style="display: none; margin-bottom: 16px;"></div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
          <button id="adminExitToWindowsBtn" class="btn btn-ghost" style="border-color: rgba(244, 63, 94, 0.4); color: #fb7185;">
            🖥️ Exit to Windows
          </button>
          <button id="adminRebootBtn" class="btn btn-ghost" style="border-color: rgba(245, 158, 11, 0.4); color: #fbbf24;">
            🔄 Reboot PC
          </button>
        </div>

        <button id="adminCancelEscapeBtn" class="btn btn-primary" style="width: 100%;">
          Return to Sky Island
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = document.getElementById('closeAdminEscapeBtn');
    const cancelBtn = document.getElementById('adminCancelEscapeBtn');
    const exitBtn = document.getElementById('adminExitToWindowsBtn');
    const rebootBtn = document.getElementById('adminRebootBtn');
    const input = document.getElementById('adminEscapePasswordInput');
    const err = document.getElementById('adminEscapeError');

    const closeModal = () => {
      modal.classList.remove('active');
      input.value = '';
      err.style.display = 'none';
      if (this.soundFX) this.soundFX.playClick();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    exitBtn.addEventListener('click', async () => {
      const pwd = input.value.trim();
      if (pwd !== this.adminPassword) {
        err.textContent = 'Incorrect Admin Password';
        err.style.display = 'block';
        return;
      }
      if (window.kioskAPI && window.kioskAPI.exitKiosk) {
        await window.kioskAPI.exitKiosk(pwd);
      } else {
        alert('Kiosk unlocked. You can now close or minimize the browser window.');
        window.close();
      }
    });

    rebootBtn.addEventListener('click', async () => {
      const pwd = input.value.trim();
      if (pwd !== this.adminPassword) {
        err.textContent = 'Incorrect Admin Password';
        err.style.display = 'block';
        return;
      }
      if (window.kioskAPI && window.kioskAPI.rebootPC) {
        await window.kioskAPI.rebootPC(pwd);
      } else {
        location.reload();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        exitBtn.click();
      }
    });
  }

  openAdminEscapeDialog() {
    const modal = document.getElementById('adminEscapeModal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('adminEscapePasswordInput');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
      if (this.soundFX) this.soundFX.playPortalEnter();
    }
  }
}
