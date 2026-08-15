# Computer Shop OS 3D — System Architecture & Comprehensive Overview

> **A Next-Gen 3D Sky Island Web Application, Character Creator, Age-Gated Media Hub, and Kiosk Lockdown Operating Environment.**

---

## 🌟 Executive Summary

**Computer Shop OS 3D** transforms the traditional computer shop kiosk desktop into a high-performance **3D floating sky island** powered by Three.js. Players sign in with their 4-digit PIN, spawn their customized 3D character, and explore interactive hubs across the island to launch games, watch age-appropriate videos, play built-in arcades, and compete on shop leaderboards.

The entire platform integrates seamlessly with the shop's **Activity Dashboard** and **Cotmon Hosting**, allowing operators to monitor pilot activity, grant bonus playtime in real time, and securely lock down the computer against unapproved exit.

---

## 🏗️ Core Architectural Components

### 1. 3D Sky Island & Performance Engine (`js/world/`)
- **Procedural Floating Archipelago**: Lush grassy plateau, dark titanium slate underbelly, glowing embedded neon conduits, and liquid plasma waterfalls plunging into space.
- **Cosmic Celestial Skybox**: Custom multi-pass sky shader blending deep space indigo with aurora horizon lighting, rotating volumetric cloud puffs, and glowing cyber stardust.
- **Zero-Lag Performance Engine (60/120 FPS)**:
  - **Zero Garbage-Collection Physics Loop**: Pre-allocated reusable Three.js vectors, matrices, and quaternions to eliminate stutter and GC pauses during motion.
  - **Selective Rendering**: The 3D Character Creator Studio only executes its render loop when the customization modal is actively open, dedicating 100% of GPU resources to the island world.
  - **ACESFilmic Tone Mapping & PCFSoft Shadows**: Crisp, AAA-tier lighting with high visual fidelity.

---

### 2. Character System, Physics Controller & Creator Studio (`js/character/`)
- **Modular 3D Humanoid Avatar**:
  - Skin tones, hairstyles (Spiky Anime, Ponytail, Cap, RGB Headset, King Crown, Space Helmet), face visors (Happy Smile, Cool Shades, Cyber VR Visor, Classic Pixel), outfits (Gamer Hoodie, Cyber Suit, Space Suit, Knight Armor), and back gear (Dragon Wings, Flame Jetpack, Hero Cape, Cyber Blade, Angel Halo).
- **Procedural Rig Animator**: Smooth procedural walk cycle, sprint, jump squash/stretch, idle breathing, and dance/wave emotes (`KeyG`, `KeyH`).
- **Snappy Third-Person Controller**:
  - Instant acceleration and deceleration friction curve (zero sludgy delay).
  - Jump buffering and coyote time for responsive jumping.
  - Critically damped spring-arm orbit camera with mouse look and cinematic sprint FOV shift (`58° -> 66°`).
  - Dynamic turn leaning (character banks realistically into high-speed turns).
- **Legacy Account Auto-Migration**:
  - Accounts registered before avatars (e.g. `Ricky`, `Migs`, PIN: `1234`) are detected automatically upon login and guided directly into the Character Creator Studio before spawning onto the island.

---

### 3. Age-Gated Hubs & Interactive OS Stations (`js/hubs/`, `js/world/hubs.js`)
- **🎮 Roblox Quantum Gateway**:
  - Dual counter-rotating accelerator rings with glowing event horizon portal.
  - Launches games via `roblox://` protocol, displays catalog (Blox Fruits, Adopt Me, Brookhaven, BedWars, Tower of Hell), and logs playtime.
- **⛏️ Minecraft Voxel Citadel**:
  - Obsidian citadel frame with shimmering nether rift and floating emerald monoliths.
  - Bedrock launcher and Cotmon LAN server status.
- **▶️ YouTube Media Nexus (Age-Aware)**:
  - **Children (<13)**: Automatically displays **YouTube Kids** with curated safe channels (SciShow Kids, PBS Kids, Nat Geo Kids, Art Hub).
  - **Teens (13+)**: Automatically displays **Regular YouTube** with full video search and embed player.
- **🚀 Space Typing Quantum Arcade**:
  - **Fully playable built-in retro space typing mini-game** with falling asteroids, laser cannons, particle explosions, streak multipliers, and leaderboard score rewards.
- **🌐 Dyson Web Observatory**:
  - Levitating glass sphere with rotating celestial rings and safe web exploration (Kiddle, Nat Geo Kids, Google Earth).
- **🏆 Apex Leaderboard Spire**:
  - Floating golden crystalline spire with weekly ranking leaderboards.
- **🔐 Kuya Ricky & Admin Command Tower**:
  - Monolithic golden beacon tower with live interactive chat, playtime bonus grants, and PIN resets.

---

### 4. Activity Dashboard & Hosting Integration (`server.js`, `js/store/accounts.js`)
- **Full REST API Compatibility**:
  - `GET /api/accounts`: Returns all gamer accounts with current playtime budgets, remaining seconds, lock states, ages, and avatar configs.
  - `POST /api/accounts/grant-time`: Allows the Activity Dashboard / Shop Admin Console to grant extra playtime (e.g. +15 min, +30 min, +1 hour) to any account remotely.
  - `POST /api/accounts/reset-pin`: Allows resetting forgotten 4-digit PINs remotely from the dashboard.
  - `GET /api/health`: Provides live heartbeat, active pilot status, and session tracking.
  - `data/accounts.json`: Durable persistent storage shared across all shop tools.
- **Real-Time Server-Sent Events (SSE) Sync (`/api/events`)**:
  - When the operator grants playtime on the **Activity Dashboard**, the 3D Sky Island live web client receives a real-time push notification, automatically updates the active pilot's HUD timer, dismisses the lock screen, and unlocks their character instantly without a page refresh!

---

### 5. Kiosk Lockdown, Anti-Escape Safety & Boot Protection (`src/electron/`, `js/kiosk/`, `scripts/`)
- **Immutable Fullscreen Kiosk Window**:
  - Electron kiosk shell (`kiosk: true`, `fullscreen: true`, `frame: false`) preventing window minimizing or dragging.
- **Keyboard Shortcut Interceptor**:
  - Swallows `Alt+F4`, `Ctrl+W`, `Ctrl+Q`, `Ctrl+R`, `F5`, `F11`, `F12`, `Ctrl+Shift+I/J/C`, `Ctrl+P`, `Ctrl+S`, `Ctrl+N`, `Ctrl+T`.
  - Disables right-click context menu and browser navigation drag-and-drop.
- **Supervised External Process Spawning**:
  - When external games (Roblox, Minecraft) are launched, the process supervisor tracks the active pilot's daily budget.
  - When playtime runs out, the supervisor terminates game process trees (`taskkill /F /IM RobloxPlayerBeta.exe`) and refocuses the 3D Daily Lock Screen.
- **Admin Password Exit Gate (`admin1234`)**:
  - The ONLY way to exit the kiosk, access the Windows desktop, or reboot the machine is by providing the Master Admin Password via `Ctrl+Alt+A` or tapping the Golden Beacon in 3D.
- **Windows Startup Shell Installer (`scripts/install-kiosk-boot.ps1`)**:
  - Configures Windows to boot directly into the 3D Sky Island Kiosk on computer power-on.

---

## 🚀 How to Run

### Development & Local Server:
```bash
# Install dependencies
npm install

# Start local server (Port 5173)
node server.js
```
Open **`http://localhost:5173`** in any modern web browser.

### Electron Kiosk Mode:
```bash
npx electron src/electron/kiosk-main.js
```

### Windows Kiosk Auto-Boot Setup:
Run PowerShell as Administrator:
```powershell
.\scripts\install-kiosk-boot.ps1 -KioskUser "Kiosk"
```
*(To restore standard Windows boot: `.\scripts\install-kiosk-boot.ps1 -Undo`)*

---

## 📁 Project Directory Structure

```
computer-shop-os-3d/
├── css/
│   ├── main.css                  # Frontier dark cyber aesthetic & HUD styling
│   ├── character-creator.css     # 3D Avatar Studio UI styles
│   └── hubs.css                  # Modals for Roblox, Minecraft, YouTube, Typing, etc.
├── data/
│   └── accounts.json             # Persistent accounts storage & playtime database
├── js/
│   ├── app.js                    # Main Application Coordinator
│   ├── audio/
│   │   └── soundfx.js            # Web Audio API sound synthesizer
│   ├── character/
│   │   ├── avatar-builder.js     # Procedural 3D humanoid avatar generator
│   │   ├── character-animator.js # Procedural skeletal rig animation engine
│   │   ├── character-creator.js  # 3D Avatar Studio controller
│   │   └── controller.js         # Snappy WASD physics controller & spring-arm camera
│   ├── hubs/
│   │   ├── admin-hub.js          # Admin console & Kuya Ricky chat
│   │   ├── leaderboard-hub.js    # Weekly rankings & Hall of Fame
│   │   ├── minecraft-hub.js      # Minecraft launcher & LAN status
│   │   ├── roblox-hub.js         # Roblox hub & protocol launcher
│   │   ├── space-typing-hub.js   # Built-in retro arcade typing minigame
│   │   ├── web-explorer-hub.js   # Safe search web explorer
│   │   └── youtube-hub.js        # Age-gated YouTube Kids / Regular YouTube
│   ├── kiosk/
│   │   └── anti-escape.js        # Web-tier shortcut blocker & admin exit gate
│   ├── store/
│   │   ├── accounts.js           # 12-slot pilot store with SSE real-time sync
│   │   └── storage.js            # Storage fallback layer
│   └── world/
│       ├── hubs.js               # 3D interactive hub megastructures
│       ├── scene-manager.js      # Three.js scene, cosmic sky shader & lighting
│       └── sky-island.js         # Procedural cyber floating archipelago terrain
├── scripts/
│   ├── install-kiosk-boot.ps1    # Auto-boot installer for Windows
│   ├── kiosk-lockdown.reg        # Windows registry policy file
│   └── start-kiosk.bat           # Startup batch launcher
├── src/
│   └── electron/
│       ├── kiosk-main.js         # Electron Kiosk main entry
│       ├── preload.js            # Electron IPC bridge
│       ├── process-supervisor.js # External game process watcher
│       └── security.js           # Electron global shortcut & window blocker
├── index.html                    # Single-page HTML entry with WebGL canvas & HUD
├── package.json                  # NPM project metadata
├── server.js                     # Standalone HTTP & Monitoring API server
├── PROJECT_SYSTEM_OVERVIEW.md    # Master technical documentation
└── README.md                     # GitHub repository overview
```
