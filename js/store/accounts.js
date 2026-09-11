// Accounts Store for Computer Shop OS 3D (with Real-time Backend Sync for Activity Dashboard)

export const GRID_SLOTS = 12;

export class AccountsStore {
  constructor() {
    this.accounts = [];
    this.nextId = 5;
    this.currentPilot = null;
    this.playTimer = null;
    this.listeners = [];
    this.eventSource = null;
    this._sseReconnectTimer = null;
    /** Cached after successful admin unlock — used as x-admin-password for grant/reset APIs */
    this._adminPasswordSession = null;

    this._initBackendSync();
  }

  setAdminPasswordSession(password) {
    this._adminPasswordSession = password ? String(password) : null;
  }

  _adminHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (this._adminPasswordSession) {
      headers['x-admin-password'] = this._adminPasswordSession;
    }
    return headers;
  }

  async _initBackendSync() {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.accounts)) {
          this.accounts = data.accounts;
          this._notify();
        }
      }
    } catch (e) {
      console.warn('Could not fetch initial accounts from backend, using memory cache:', e);
    }

    this._connectSSE();
  }

  _connectSSE() {
    if (typeof EventSource === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (_) {}
      this.eventSource = null;
    }
    if (this._sseReconnectTimer) {
      clearTimeout(this._sseReconnectTimer);
      this._sseReconnectTimer = null;
    }

    this.eventSource = new EventSource('/api/events');

    this.eventSource.addEventListener('init', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data && Array.isArray(data.accounts)) {
          this.accounts = data.accounts;
          if (this.currentPilot) {
            const updated = this.accounts.find((a) => a.id === this.currentPilot.id);
            if (updated) this.currentPilot = { ...updated, ...this.currentPilot, remainingSeconds: updated.remainingSeconds, lockedToday: updated.lockedToday };
          }
          this._notify();
        }
      } catch (err) {}
    });

    this.eventSource.addEventListener('playtime-granted', (e) => {
      try {
        const info = JSON.parse(e.data);
        const acct = this.accounts.find((a) => a.id === info.accountId);
        if (acct) {
          acct.remainingSeconds = info.remainingSeconds;
          acct.lockedToday = info.lockedToday;
          if (this.currentPilot && this.currentPilot.id === acct.id) {
            this.currentPilot.remainingSeconds = info.remainingSeconds;
            this.currentPilot.lockedToday = info.lockedToday;
            const lockOverlay = document.getElementById('dailyLockOverlay');
            if (lockOverlay) lockOverlay.classList.remove('active');
          }
          this._notify();
        }
      } catch (err) {}
    });

    this.eventSource.addEventListener('avatar-updated', (e) => {
      try {
        const acct = JSON.parse(e.data);
        const local = this.accounts.find((a) => a.id === acct.id);
        if (local) {
          local.avatar = acct.avatar;
          local.age = acct.age;
          local.ageGroup = acct.ageGroup;
          this._notify();
        }
      } catch (err) {}
    });

    this.eventSource.addEventListener('pin-reset', () => {
      this.refreshFromBackend();
    });

    this.eventSource.onerror = () => {
      if (this.eventSource) {
        try {
          this.eventSource.close();
        } catch (_) {}
        this.eventSource = null;
      }
      this._sseReconnectTimer = setTimeout(() => this._connectSSE(), 5000);
    };
  }

  async refreshFromBackend() {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.accounts)) {
          this.accounts = data.accounts;
          if (this.currentPilot) {
            const updated = this.accounts.find((a) => a.id === this.currentPilot.id);
            if (updated) {
              this.currentPilot = {
                ...this.currentPilot,
                ...updated,
                remainingSeconds: this.currentPilot.remainingSeconds != null
                  ? Math.min(this.currentPilot.remainingSeconds, updated.remainingSeconds)
                  : updated.remainingSeconds
              };
            }
          }
          this._notify();
        }
      }
    } catch (e) {}
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  _notify() {
    this.listeners.forEach((fn) => fn(this));
  }

  listAccounts() {
    return this.accounts;
  }

  getSlotMap() {
    const map = new Array(GRID_SLOTS).fill(null);
    this.accounts.forEach((acct) => {
      if (acct.gridSlot != null && acct.gridSlot < GRID_SLOTS) {
        map[acct.gridSlot] = acct;
      }
    });
    return map;
  }

  getAccountById(id) {
    return this.accounts.find((a) => a.id === Number(id));
  }

  getAccountByName(name) {
    const n = String(name || '').trim().toLowerCase();
    return this.accounts.find((a) => a.name.toLowerCase() === n);
  }

  async register(name, pin, age, gridSlot = null) {
    const cleanName = String(name || '').trim().slice(0, 20);
    const pinStr = String(pin || '').trim();
    const ageNum = parseInt(age, 10) || 10;

    if (!cleanName || cleanName.length < 2) {
      return { ok: false, error: 'Name must be at least 2 characters.' };
    }
    if (!/^\d{4}$/.test(pinStr)) {
      return { ok: false, error: 'PIN must be exactly 4 digits.' };
    }
    if (this.getAccountByName(cleanName)) {
      return { ok: false, error: 'That name is already taken!' };
    }

    try {
      const res = await fetch('/api/accounts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, pin: pinStr, age: ageNum, gridSlot })
      });
      const data = await res.json();
      if (data.ok) {
        this.currentPilot = data.account;
        await this.refreshFromBackend();
        this.startPlaySession();
        return { ok: true, account: data.account, needsAvatar: true };
      }
      return { ok: false, error: data.error || 'Failed to register' };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async login(name, pin) {
    try {
      const res = await fetch('/api/accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin: String(pin).trim() })
      });
      const data = await res.json();
      if (!data.ok) {
        return { ok: false, error: data.error || 'Login failed.' };
      }

      this.currentPilot = data.account;
      // Refresh list without overwriting the just-logged-in pilot object identity
      await this.refreshFromBackend();
      const refreshed = this.getAccountById(data.account.id);
      if (refreshed) this.currentPilot = refreshed;

      this.startPlaySession();
      this._notify();
      return { ok: true, account: this.currentPilot, needsAvatar: data.needsAvatar };
    } catch (e) {
      return { ok: false, error: e.message || 'Login failed.' };
    }
  }

  async logout() {
    this.stopPlaySession();
    this.currentPilot = null;
    try {
      await fetch('/api/accounts/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    } catch (e) {}
    this._notify();
  }

  async saveAvatar(accountId, avatarData, age = null) {
    const acct = this.getAccountById(accountId);
    if (!acct) return { ok: false, error: 'Account not found' };

    acct.avatar = avatarData;
    if (age != null) {
      const ageNum = parseInt(age, 10) || acct.age || 10;
      acct.age = ageNum;
      acct.ageGroup = ageNum >= 13 ? 'teen' : 'child';
    }

    try {
      await fetch('/api/accounts/update-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, avatar: avatarData, age })
      });
    } catch (e) {}

    this._notify();
    return { ok: true, account: acct };
  }

  startPlaySession() {
    this.stopPlaySession();
    if (!this.currentPilot) return;

    this.playTimer = setInterval(async () => {
      if (!this.currentPilot) return;
      if (this.currentPilot.remainingSeconds > 0) {
        this.currentPilot.remainingSeconds -= 1;
        this.currentPilot.weeklySeconds = (this.currentPilot.weeklySeconds || 0) + 1;
        if (this.currentPilot.remainingSeconds <= 0) {
          this.currentPilot.lockedToday = true;
        }
        this._notify();
        // Sync absolute remaining seconds every 15s (avoids double-decrement drift)
        if (this.currentPilot.remainingSeconds % 15 === 0) {
          try {
            await fetch('/api/accounts/tick', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accountId: this.currentPilot.id,
                remainingSeconds: this.currentPilot.remainingSeconds,
                weeklySeconds: this.currentPilot.weeklySeconds
              })
            });
          } catch (e) {}
        }
      }
    }, 1000);
  }

  stopPlaySession() {
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }

  async grantBonusMinutes(accountId, minutes) {
    try {
      const res = await fetch('/api/accounts/grant-time', {
        method: 'POST',
        headers: this._adminHeaders(),
        body: JSON.stringify({ accountId, minutes })
      });
      const data = await res.json();
      if (data.ok) {
        const acct = this.getAccountById(accountId);
        if (acct) {
          acct.remainingSeconds = data.remainingSeconds;
          acct.lockedToday = acct.remainingSeconds <= 0;
          if (this.currentPilot && this.currentPilot.id === accountId) {
            this.currentPilot.remainingSeconds = data.remainingSeconds;
            this.currentPilot.lockedToday = acct.lockedToday;
          }
          this._notify();
        }
        return { ok: true, remainingSeconds: data.remainingSeconds };
      }
      return { ok: false, error: data.error };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async resetPin(accountId, newPin) {
    try {
      const res = await fetch('/api/accounts/reset-pin', {
        method: 'POST',
        headers: this._adminHeaders(),
        body: JSON.stringify({ accountId, newPin })
      });
      return await res.json();
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async verifyAdminPassword(password) {
    if (window.kioskAPI && window.kioskAPI.verifyAdminPassword) {
      const ok = await window.kioskAPI.verifyAdminPassword(password);
      if (ok) this.setAdminPasswordSession(password);
      return { ok: !!ok };
    }
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.ok) this.setAdminPasswordSession(password);
      return data;
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async updateAge(accountId, newAge) {
    const acct = this.getAccountById(accountId);
    if (!acct) return { ok: false, error: 'Account not found' };
    const a = parseInt(newAge, 10);
    if (isNaN(a) || a < 3 || a > 99) return { ok: false, error: 'Invalid age' };
    return this.saveAvatar(accountId, acct.avatar, a);
  }

  getLeaderboard() {
    return [...this.accounts]
      .filter((a) => (a.weeklySeconds || 0) > 0)
      .sort((a, b) => (b.weeklySeconds || 0) - (a.weeklySeconds || 0));
  }
}

export const accountsStore = new AccountsStore();
