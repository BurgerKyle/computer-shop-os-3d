# Computer Shop OS 3D (Sky Island & Kiosk Operating System)

[![CI](https://github.com/BurgerKyle/computer-shop-os-3d/actions/workflows/ci.yml/badge.svg)](https://github.com/BurgerKyle/computer-shop-os-3d/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black)](https://threejs.org/)

A **3D floating sky-island web app and kiosk shell** for computer shop terminals. Interactive world, modular character creator, age gating (YouTube Kids vs regular YouTube), and real-time sync with the shop Activity Dashboard.

---

## Features

- **3D Sky Island** — procedural terrain, hubs for Roblox / Minecraft / YouTube / typing arcade
- **Character creator** — skin, hair, outfits, back gear; legacy accounts prompted on first login
- **Age-gated media** — kids (&lt;13) get curated YouTube Kids; teens get full YouTube
- **Playtime sync** — SSE `/api/events`; dashboard grants update the 3D client live
- **Kiosk lockdown** — browser/Electron anti-escape; admin gate via `Ctrl+Alt+A` or corner taps

---

## Controls

| Control | Action |
|---|---|
| **W A S D / Arrows** | Move |
| **Shift** | Sprint |
| **Space** | Jump |
| **Mouse drag / scroll** | Orbit / zoom camera |
| **E** | Interact with nearest hub |
| **G / H** | Dance / wave |
| **Ctrl + Alt + A** | Admin kiosk gate (password from `ADMIN_PASSWORD`) |

---

## Getting started

```bash
git clone https://github.com/BurgerKyle/computer-shop-os-3d.git
cd computer-shop-os-3d
cp .env.example .env   # set ADMIN_PASSWORD + MONITORING_TOKEN
npm install
npm start              # http://localhost:5173
```

### Checks

```bash
npm run check   # smoke + unit tests
npm test
```

### Electron kiosk (Windows shop PCs)

```bash
npx electron src/electron/kiosk-main.js
```

### Auto-boot (Windows)

```powershell
.\scripts\install-kiosk-boot.ps1 -KioskUser "Kiosk"
```

---

## Security notes

- Set **`ADMIN_PASSWORD`** and **`MONITORING_TOKEN`** in the environment (see `.env.example`). Defaults exist only for local/dev and log a warning.
- Account **PINs are not returned** from `GET /api/accounts` or SSE; login is `POST /api/accounts/login`.
- Grant-time / reset-pin require `Authorization: Bearer <MONITORING_TOKEN>` or `x-admin-password: <ADMIN_PASSWORD>`.
- Static serving blocks path traversal and does not expose `data/accounts.json`.
- Runtime data (`data/accounts.json`) is gitignored.

---

## Docs

See **[PROJECT_SYSTEM_OVERVIEW.md](PROJECT_SYSTEM_OVERVIEW.md)** for architecture and API details.
