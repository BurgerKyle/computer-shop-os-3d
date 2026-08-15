// Electron Security & Anti-Escape Enforcement
const { globalShortcut } = require('electron');

const BLOCKED_ACCELERATORS = [
  'CommandOrControl+R',
  'CommandOrControl+Shift+R',
  'F5',
  'F11',
  'F12',
  'CommandOrControl+W',
  'CommandOrControl+Shift+W',
  'CommandOrControl+Q',
  'CommandOrControl+Shift+I',
  'CommandOrControl+Shift+J',
  'CommandOrControl+Shift+C',
  'Alt+F4',
  'CommandOrControl+P',
  'CommandOrControl+S',
  'CommandOrControl+N',
  'CommandOrControl+T',
  'CommandOrControl+Shift+T',
  'CommandOrControl+Alt+Tab'
];

function enableKioskSecurity(win) {
  // 1. Swallow global accelerators
  for (const accel of BLOCKED_ACCELERATORS) {
    try {
      globalShortcut.register(accel, () => {
        // Swallowed intentionally
      });
    } catch (e) {}
  }

  // 2. Guard BrowserWindow inputs
  if (win && win.webContents) {
    win.webContents.on('before-input-event', (event, input) => {
      const key = (input.key || '').toLowerCase();
      const ctrl = input.control || input.meta;
      const alt = input.alt;

      const block =
        key === 'f5' ||
        key === 'f11' ||
        key === 'f12' ||
        key === 'f1' ||
        key === 'f3' ||
        (alt && key === 'f4') ||
        (ctrl && ['r', 'w', 'q', 'p', 's', 'n', 't', 'u', 'h', 'j'].includes(key)) ||
        (ctrl && input.shift && ['i', 'j', 'c', 'r', 'delete'].includes(key));

      if (block) {
        event.preventDefault();
      }
    });

    // 3. Deny new window popups / tabs
    win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    // 4. Disable standard context menus
    win.webContents.on('context-menu', (e) => {
      e.preventDefault();
    });

    // 5. Enforce full screen stay
    win.on('leave-full-screen', () => {
      win.setFullScreen(true);
    });

    win.on('restore', () => {
      win.setFullScreen(true);
    });
  }
}

function disableKioskSecurity() {
  globalShortcut.unregisterAll();
}

module.exports = {
  enableKioskSecurity,
  disableKioskSecurity
};
