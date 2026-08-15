// Electron Preload Bridge for Computer Shop OS 3D
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('kioskAPI', {
  verifyAdminPassword: (password) => ipcRenderer.invoke('admin-verify-password', password),
  exitKiosk: (password) => ipcRenderer.invoke('admin-exit-kiosk', password),
  rebootPC: (password) => ipcRenderer.invoke('admin-reboot-pc', password),
  shutdownPC: (password) => ipcRenderer.invoke('admin-shutdown-pc', password),
  launchRoblox: () => ipcRenderer.invoke('launch-roblox'),
  launchMinecraft: () => ipcRenderer.invoke('launch-minecraft'),
  notifyPlaytimeExpired: () => ipcRenderer.invoke('playtime-expired')
});
