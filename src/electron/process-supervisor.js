// Process Supervisor for External Games (Roblox, Minecraft, etc.)
const { exec, spawn } = require('child_process');

class ProcessSupervisor {
  constructor() {
    this.activeProcesses = new Map(); // pid -> info
    this.watchTimer = null;
  }

  startMonitoring(getRemainingSecondsCallback, onPlaytimeExpiredCallback) {
    if (this.watchTimer) clearInterval(this.watchTimer);

    this.watchTimer = setInterval(() => {
      const remaining = getRemainingSecondsCallback();
      if (remaining <= 0) {
        this.terminateAll();
        if (onPlaytimeExpiredCallback) onPlaytimeExpiredCallback();
      }
    }, 1000);
  }

  stopMonitoring() {
    if (this.watchTimer) {
      clearInterval(this.watchTimer);
      this.watchTimer = null;
    }
  }

  launchRoblox() {
    try {
      // Launch via protocol handler or client executable
      const proc = spawn('cmd.exe', ['/c', 'start', 'roblox://'], { detached: true, stdio: 'ignore' });
      proc.unref();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  launchMinecraft() {
    try {
      // Launch Bedrock via shell protocol
      const proc = spawn('cmd.exe', ['/c', 'start', 'minecraft://'], { detached: true, stdio: 'ignore' });
      proc.unref();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  terminateAll() {
    // Terminate standard kid game process trees on playtime expiration
    const targets = [
      'RobloxPlayerBeta.exe',
      'Minecraft.Windows.exe',
      'javaw.exe',
      'chrome.exe',
      'msedge.exe'
    ];

    targets.forEach(exe => {
      exec(`taskkill /F /IM ${exe}`, () => {
        // Silently terminate without throwing if process not found
      });
    });
  }
}

module.exports = new ProcessSupervisor();
