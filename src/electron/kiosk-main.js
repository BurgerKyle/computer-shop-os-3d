// Electron Main Kiosk Shell for Computer Shop OS 3D
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const { enableKioskSecurity, disableKioskSecurity } = require('./security.js');
const supervisor = require('./process-supervisor.js');

let mainWindow = null;
let serverProcess = null;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

function startBackendServer() {
  const serverScript = path.join(__dirname, '..', '..', 'server.js');
  serverProcess = fork(serverScript, [], {
    env: { ...process.env, PORT: '5173' },
    stdio: 'ignore'
  });
}

function createKioskWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    kiosk: true,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: false,
    resizable: false,
    movable: false,
    backgroundColor: '#030712',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  enableKioskSecurity(mainWindow);

  // Load the 3D Sky Island Web Application
  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    startBackendServer();
    // Wait brief moment for server to bind port
    setTimeout(() => {
      createKioskWindow();
    }, 600);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createKioskWindow();
    });
  });
}

// IPC Handlers for Kiosk Control & Admin Authentication
ipcMain.handle('admin-verify-password', (event, password) => {
  return String(password).trim() === ADMIN_PASSWORD;
});

ipcMain.handle('admin-exit-kiosk', (event, password) => {
  if (String(password).trim() === ADMIN_PASSWORD) {
    disableKioskSecurity();
    if (serverProcess) serverProcess.kill();
    app.exit(0);
    return { ok: true };
  }
  return { ok: false, error: 'Incorrect Admin Password' };
});

ipcMain.handle('admin-reboot-pc', (event, password) => {
  if (String(password).trim() === ADMIN_PASSWORD) {
    const { exec } = require('child_process');
    exec('shutdown /r /t 0');
    return { ok: true };
  }
  return { ok: false, error: 'Incorrect Admin Password' };
});

ipcMain.handle('admin-shutdown-pc', (event, password) => {
  if (String(password).trim() === ADMIN_PASSWORD) {
    const { exec } = require('child_process');
    exec('shutdown /s /t 0');
    return { ok: true };
  }
  return { ok: false, error: 'Incorrect Admin Password' };
});

ipcMain.handle('launch-roblox', () => {
  return supervisor.launchRoblox();
});

ipcMain.handle('launch-minecraft', () => {
  return supervisor.launchMinecraft();
});

ipcMain.handle('playtime-expired', () => {
  supervisor.terminateAll();
  if (mainWindow) {
    mainWindow.restore();
    mainWindow.focus();
  }
  return { ok: true };
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
