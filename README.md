# 🏝️ Computer Shop OS 3D (Sky Island & Kiosk Operating System)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black)](https://threejs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()

A next-generation **3D Floating Sky Island Web App and Kiosk Shell** for computer shop terminals. Features an interactive 3D world, modular character creator, age gating (YouTube Kids vs Regular YouTube), responsive 60/120 FPS physics, and seamless real-time integration with the shop's **Activity Dashboard** and **Cotmon Hosting**.

---

## ✨ Features

- **🏝️ 3D Floating Sky Island**: Procedural cyber-floating terrain with lush emerald plateaus, dark titanium rock formations, neon energy conduits, and waterfalls into space.
- **⚡ Zero-Lag 60/120 FPS Engine**: Garbage-collection free physics loop, selective studio rendering, and tuned ACESFilmic tone mapping.
- **🏃 Responsive WASD Controls & Spring-Arm Camera**: Snappy acceleration curve, jump buffering, coyote time, and cinematic sprint FOV shift.
- **🎨 Modular 3D Character Creator**: Custom skin tones, anime/gamer hairstyles, cool visors/shades, techwear hoodies/cyber suits, and animated dragon wings/jetpacks.
- **🔄 Legacy Account Auto-Migration**: Automatically prompts legacy accounts to create their custom avatar on first sign-in.
- **👶 Age-Gated Media (YouTube Kids vs Regular YouTube)**: Automatically detects age group:
  - **Kids (<13)**: Curated safe YouTube Kids channels (SciShow Kids, PBS Kids, Nat Geo Kids, Art Hub).
  - **Teens (13+)**: Regular YouTube with full search and video player.
- **🚀 Built-in Space Typing Arcade**: Full retro arcade typing mini-game with falling asteroids, laser cannons, particle explosions, streak multipliers, and leaderboard score rewards.
- **📊 Real-Time Activity Dashboard Sync**: Connects to `/api/events` SSE stream. Adding playtime on the **Activity Dashboard** instantly updates the 3D client and unlocks the player without reloading!
- **🔒 Kiosk Lockdown & Anti-Escape Safety**:
  - Traps `Alt+F4`, `Ctrl+W`, `F11`, `F12`, `Ctrl+Shift+I`, right-click menus, and window popups.
  - External process supervisor that terminates games when playtime runs out.
  - Password-protected Admin Exit Gate (`admin1234`) via `Ctrl+Alt+A` or tapping the Golden Beacon in 3D.
  - Auto-boot script to start directly into the 3D Kiosk on computer power-on.

---

## 🕹️ Controls

| Control | Action |
|---|---|
| **W, A, S, D / Arrows** | Walk / Run across Sky Island |
| **Shift** | Sprint (Cinematic FOV Shift) |
| **Space** | Jump |
| **Mouse Drag** | Orbit Follow Camera |
| **Scroll Wheel** | Zoom In / Out |
| **E** | Interact with Hub Station (Roblox, Minecraft, YouTube, etc.) |
| **G / H** | Dance / Wave Emote |
| **Ctrl + Alt + A** | Secret Admin Exit Gate (Password: `admin1234`) |

---

## 🚀 Getting Started

### 1. Install & Run Locally
```bash
# Clone the repository
git clone https://github.com/BurgerKyle/computer-shop-os-3d.git
cd computer-shop-os-3d

# Start the web & API server
node server.js
```
Open **`http://localhost:5173`** in your browser.

### 2. Run in Locked Electron Kiosk
```bash
npx electron src/electron/kiosk-main.js
```

### 3. Setup Auto-Boot on Windows Startup
Run PowerShell as Administrator:
```powershell
.\scripts\install-kiosk-boot.ps1 -KioskUser "Kiosk"
```

---

## 📖 Complete System Documentation

For in-depth architectural breakdown, REST API endpoints, and supervisor details, see **[PROJECT_SYSTEM_OVERVIEW.md](PROJECT_SYSTEM_OVERVIEW.md)**.
