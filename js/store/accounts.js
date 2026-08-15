// Accounts Store for Computer Shop OS 3D (with Real-time Backend Sync for Activity Dashboard)

export const GRID_SLOTS = 12;

export class AccountsStore {
  constructor() {
    this.accounts = [];
    this.nextId = 5;
    this.adminPin = 'admin1234';
    this.currentPilot = null;
    this.playTimer = null;
    this.listeners = [];
    this.eventSource = null;

    this._initBackendSync();
  }

  async _initBackendSync() {
    // Initial fetch from backend
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

    // Connect to Server-Sent Events stream for live Activity Dashboard updates
    this._connectSSE();
  }

  _connectSSE() {
    if (typeof EventSource === 'undefined') return;

    this.eventSource = new EventSource('/api/events');

    this.eventSource.addEventListener('init', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data && Array.isArray(data.accounts)) {
          this.accounts = data.accounts;
          if (this.currentPilot) {
            const updated = this.accounts.find(a => a.id === this.currentPilot.id);
            if (updated) this.currentPilot = updated;
          }
          this._notify();
        }
      } catch (err) {}
    });

    // Real-time playtime granted from Activity Dashboard / Admin Console
    this.eventSource.addEventListener('playtime-granted', (e) => {
      try {
        const info = JSON.parse(e.data);
        const acct = this.accounts.find(a => a.id === info.accountId);
        if (acct) {
          acct.remainingSeconds = info.remainingSeconds;
          acct.lockedToday = info.lockedToday;
          if (this.currentPilot && this.currentPilot.id === acct.id) {
            this.currentPilot.remainingSeconds = info.remainingSeconds;
            this.currentPilot.lockedToday = info.lockedToday;
            // Dismiss daily lock modal if active
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
        const local = this.accounts.find(a => a.id === acct.id);
        if (local) {
          local.avatar = acct.avatar;
          local.age = acct.age;
          local.ageGroup = acct.ageGroup;
          this._notify();
        }
      } catch (err) {}
    });

    this.eventSource.addEventListener('pin-reset', (e) => {
      this.refreshFromBackend();
    });

    this.eventSource.onerror = () => {
      // Reconnect after brief delay
      setTimeout(() => this._connectSSE(), 5000);
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
            const updated = this.accounts.find(a => a.id === this.currentPilot.id);
            if (updated) this.currentPilot = updated;
          }
          this._notify();
        }
      }
    } catch (e) {}
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  _notify() {
    this.listeners.forEach(fn => fn(this));
  }

  listAccounts() {
    return this.accounts;
  }

  getSlotMap() {
    const map = new Array(GRID_SLOTS).fill(null);
    this.accounts.forEach(acct => {
      if (acct.gridSlot != null && acct.gridSlot < GRID_SLOTS) {
        map[acct.gridSlot] = acct;
      }
    });
    return map;
  }

  getAccountById(id) {
    return this.accounts.find(a => a.id === Number(id));
  }

  getAccountByName(name) {
    const n = String(name || '').trim().toLowerCase();
    return this.accounts.find(a => a.name.toLowerCase() === n);
  }

  async register(name, pin, age, gridSlot = null) {
    const cleanName = String(name || '').trim().slice(0, 20);
    const pinStr = String(pin || '').trim();
    const ageNum = parseInt(age, 10) || 10;
    const ageGroup = ageNum >= 13 ? 'teen' : 'child';

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
        return { ok: true, account: data.account, needsAvatar: true };
      } else {
        return { ok: false, error: data.error || 'Failed to register' };
      }
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  login(name, pin) {
    const acct = this.getAccountByName(name);
    if (!acct) {
      return { ok: false, error: 'Account not found.' };
    }
    if (acct.pin !== String(pin).trim()) {
      return { ok: false, error: 'Wrong 4-digit PIN.' };
    }

    acct.lastLogin = new Date().toISOString();
    this.currentPilot = acct;

    const needsAvatar = !acct.avatar;

    this.startPlaySession();
    this._notify();

    return { ok: true, account: acct, needsAvatar };
  }

  logout() {
    this.stopPlaySession();
    this.currentPilot = null;
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
          this._notify();
        }
        // Send tick to backend every 15s to keep disk in sync
        if (this.currentPilot.remainingSeconds % 15 === 0) {
          try {
            await fetch('/api/accounts/tick', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accountId: this.currentPilot.id })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, minutes })
      });
      const data = await res.json();
      if (data.ok) {
        const acct = this.getAccountById(accountId);
        if (acct) {
          acct.remainingSeconds = data.remainingSeconds;
          acct.lockedToday = acct.remainingSeconds <= 0;
          this._notify();
        }
        return { ok: true, remainingSeconds: data.remainingSeconds };
      }
    } catch (e) {}
    return { ok: false };
  }

  async resetPin(accountId, newPin) {
    try {
      const res = await fetch('/api/accounts/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, newPin })
      });
      const data = await res.json();
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
      .filter(a => (a.weeklySeconds || 0) > 0)
      .sort((a, b) => (b.weeklySeconds || 0) - (a.weeklySeconds || 0));
  }
}

export const accountsStore = new AccountsStore();
