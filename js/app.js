// Main Application Coordinator for Computer Shop OS 3D
import * as THREE from 'three';
import { soundFX } from './audio/soundfx.js';
import { accountsStore, GRID_SLOTS } from './store/accounts.js';
import { AvatarBuilder } from './character/avatar-builder.js';
import { CharacterAnimator } from './character/character-animator.js';
import { CharacterController } from './character/controller.js';
import { CharacterCreatorStudio } from './character/character-creator.js';
import { SceneManager } from './world/scene-manager.js';
import { SkyIsland } from './world/sky-island.js';
import { HubsManager } from './world/hubs.js';
import { KioskAntiEscape } from './kiosk/anti-escape.js';

// Hub Controllers
import { RobloxHub } from './hubs/roblox-hub.js';
import { MinecraftHub } from './hubs/minecraft-hub.js';
import { YouTubeHub } from './hubs/youtube-hub.js';
import { SpaceTypingHub } from './hubs/space-typing-hub.js';
import { WebExplorerHub } from './hubs/web-explorer-hub.js';
import { LeaderboardHub } from './hubs/leaderboard-hub.js';
import { AdminHub } from './hubs/admin-hub.js';

class App {
  constructor() {
    this.canvas = document.getElementById('canvas3d');
    this.sceneManager = new SceneManager(this.canvas);
    this.skyIsland = new SkyIsland(this.sceneManager.scene);
    this.hubsManager = new HubsManager(this.sceneManager.scene);
    this.antiEscape = new KioskAntiEscape(soundFX);

    this.currentCharacter = null;
    this.currentRig = null;
    this.currentAnimator = null;
    this.controller = null;
    this.clock = new THREE.Clock();

    this.creatorStudio = null;
    this.activeHub = null;
    this.pendingSlot = null;
    this.selectedAccount = null;

    this._init();
  }

  _init() {
    this._initCharacterCreator();
    this._initHUD();
    this._initAccountPicker();
    this._initHubModals();
    this._startLoop();

    // Subscribe to accounts changes
    accountsStore.subscribe(() => {
      this._updateHUD();
      this._renderAccountGrid();
      this._checkPlaytimeLock();
    });

    // Check if a pilot was already logged in with an avatar
    if (accountsStore.currentPilot) {
      if (accountsStore.currentPilot.avatar) {
        this.spawnPilot(accountsStore.currentPilot);
      } else {
        this.creatorStudio.open(accountsStore.currentPilot, true);
      }
    } else {
      this.showWelcomeScreen();
    }
  }

  _initCharacterCreator() {
    this.creatorStudio = new CharacterCreatorStudio(
      document.getElementById('creatorPreviewCanvas'),
      (accountId, avatarConfig, age) => {
        accountsStore.saveAvatar(accountId, avatarConfig, age);
        const acct = accountsStore.getAccountById(accountId);
        this.spawnPilot(acct);
      },
      soundFX
    );
  }

  _initHUD() {
    // Clock
    const clockEl = document.getElementById('hudClock');
    const updateClock = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    };
    setInterval(updateClock, 1000);
    updateClock();

    // Switch Gamer button
    const pilotBtn = document.getElementById('pilotHudBtn');
    if (pilotBtn) {
      pilotBtn.addEventListener('click', () => {
        soundFX.playClick();
        if (accountsStore.currentPilot) {
          if (confirm(`Switch gamer? ${accountsStore.currentPilot.name} will be logged out.`)) {
            accountsStore.logout();
            this.despawnPilot();
            this.showWelcomeScreen();
          }
        } else {
          this.showWelcomeScreen();
        }
      });
    }

    // Audio BGM Toggle
    const bgmBtn = document.getElementById('hudBgmBtn');
    if (bgmBtn) {
      bgmBtn.addEventListener('click', () => {
        const isPlaying = soundFX.toggleBgm();
        bgmBtn.textContent = isPlaying ? '🎵 Music: ON' : '🔇 Music: OFF';
      });
    }

    // Admin quick button
    const adminBtn = document.getElementById('hudAdminBtn');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        AdminHub.open(accountsStore, soundFX);
      });
    }

    // Wardrobe quick button
    const wardrobeBtn = document.getElementById('hudWardrobeBtn');
    if (wardrobeBtn) {
      wardrobeBtn.addEventListener('click', () => {
        if (accountsStore.currentPilot) {
          soundFX.playClick();
          this.creatorStudio.open(accountsStore.currentPilot, false);
        }
      });
    }

    // Emote buttons
    const emoteDanceBtn = document.getElementById('emoteDanceBtn');
    if (emoteDanceBtn) {
      emoteDanceBtn.addEventListener('click', () => {
        if (this.currentAnimator) {
          this.currentAnimator.setState(this.currentAnimator.state === 'dance' ? 'idle' : 'dance');
        }
      });
    }

    const emoteWaveBtn = document.getElementById('emoteWaveBtn');
    if (emoteWaveBtn) {
      emoteWaveBtn.addEventListener('click', () => {
        if (this.currentAnimator) {
          this.currentAnimator.setState(this.currentAnimator.state === 'wave' ? 'idle' : 'wave');
        }
      });
    }
  }

  _updateHUD() {
    const pilot = accountsStore.currentPilot;
    const pilotNameEl = document.getElementById('hudPilotName');
    const pilotAvatarDot = document.getElementById('hudAvatarDot');
    const ageBadge = document.getElementById('hudAgeBadge');
    const playtimeBadge = document.getElementById('hudPlaytimeBadge');
    const playtimeTime = document.getElementById('hudPlaytimeTime');

    if (pilot) {
      if (pilotNameEl) pilotNameEl.textContent = pilot.name;
      if (pilotAvatarDot) pilotAvatarDot.textContent = pilot.name.charAt(0).toUpperCase();

      if (ageBadge) {
        ageBadge.hidden = false;
        ageBadge.textContent = pilot.ageGroup === 'teen' ? `TEEN (${pilot.age})` : `KID (${pilot.age})`;
        ageBadge.className = `age-badge ${pilot.ageGroup}`;
      }

      if (playtimeBadge && playtimeTime) {
        playtimeBadge.hidden = false;
        const rem = pilot.remainingSeconds || 0;
        const mins = Math.floor(rem / 60);
        const secs = rem % 60;
        playtimeTime.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        playtimeBadge.classList.toggle('low', rem <= 300);
      }
    } else {
      if (pilotNameEl) pilotNameEl.textContent = "Who's playing?";
      if (pilotAvatarDot) pilotAvatarDot.textContent = "?";
      if (ageBadge) ageBadge.hidden = true;
      if (playtimeBadge) playtimeBadge.hidden = true;
    }
  }

  _checkPlaytimeLock() {
    const pilot = accountsStore.currentPilot;
    if (pilot && pilot.remainingSeconds <= 0) {
      const lockOverlay = document.getElementById('dailyLockOverlay');
      const lockPilotName = document.getElementById('lockPilotName');
      if (lockOverlay) lockOverlay.classList.add('active');
      if (lockPilotName) lockPilotName.textContent = pilot.name;
      
      // Notify Electron Process Supervisor to kill any running external game processes
      if (window.kioskAPI && window.kioskAPI.notifyPlaytimeExpired) {
        window.kioskAPI.notifyPlaytimeExpired();
      }
    }
  }

  _initAccountPicker() {
    this._renderAccountGrid();

    // PIN Login Submit
    const pinSubmitBtn = document.getElementById('submitPinLoginBtn');
    const pinInput = document.getElementById('loginPinInput');
    const pinBackBtn = document.getElementById('pinLoginBackBtn');
    const pinError = document.getElementById('pinLoginError');

    const doPinLogin = () => {
      if (!this.selectedAccount) return;
      const res = accountsStore.login(this.selectedAccount.name, pinInput.value);
      if (!res.ok) {
        pinError.textContent = res.error || 'Wrong PIN';
        pinError.hidden = false;
        return;
      }
      pinError.hidden = true;
      this.hideWelcomeScreen();

      if (res.needsAvatar) {
        // Legacy account migration prompt!
        this.creatorStudio.open(res.account, true);
      } else {
        soundFX.playPortalEnter();
        this.spawnPilot(res.account);
      }
    };

    if (pinSubmitBtn) pinSubmitBtn.addEventListener('click', doPinLogin);
    if (pinInput) {
      pinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doPinLogin();
      });
    }
    if (pinBackBtn) {
      pinBackBtn.addEventListener('click', () => {
        this._showWelcomeView('grid');
      });
    }

    // Account Creation Submit
    const createSubmitBtn = document.getElementById('submitCreateAccountBtn');
    const createNameInput = document.getElementById('createNameInput');
    const createPinInput = document.getElementById('createPinInput');
    const createBackBtn = document.getElementById('createAccountBackBtn');
    const createError = document.getElementById('createAccountError');

    let selectedCreateAge = 10;
    const createAgeChild = document.getElementById('createAgeChild');
    const createAgeTeen = document.getElementById('createAgeTeen');

    if (createAgeChild && createAgeTeen) {
      createAgeChild.addEventListener('click', () => {
        selectedCreateAge = 9;
        createAgeChild.classList.add('active');
        createAgeTeen.classList.remove('active');
        soundFX.playClick();
      });

      createAgeTeen.addEventListener('click', () => {
        selectedCreateAge = 14;
        createAgeTeen.classList.add('active');
        createAgeChild.classList.remove('active');
        soundFX.playClick();
      });
    }

    const doCreate = () => {
      const name = createNameInput.value.trim();
      const pin = createPinInput.value.trim();

      const res = accountsStore.register(name, pin, selectedCreateAge, this.pendingSlot);
      if (!res.ok) {
        createError.textContent = res.error || 'Error creating account';
        createError.hidden = false;
        return;
      }
      createError.hidden = true;
      this.hideWelcomeScreen();

      // Open Character Creator for new account
      this.creatorStudio.open(res.account, false);
    };

    if (createSubmitBtn) createSubmitBtn.addEventListener('click', doCreate);
    if (createPinInput) {
      createPinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doCreate();
      });
    }
    if (createBackBtn) {
      createBackBtn.addEventListener('click', () => {
        this._showWelcomeView('grid');
      });
    }

    // Daily Lock next pilot button
    const nextPilotBtn = document.getElementById('nextPilotBtn');
    if (nextPilotBtn) {
      nextPilotBtn.addEventListener('click', () => {
        document.getElementById('dailyLockOverlay').classList.remove('active');
        accountsStore.logout();
        this.despawnPilot();
        this.showWelcomeScreen();
      });
    }
  }

  _showWelcomeView(view) {
    document.getElementById('accountGridView').hidden = view !== 'grid';
    document.getElementById('accountPinAuthView').hidden = view !== 'pin';
    document.getElementById('accountCreateView').hidden = view !== 'create';
  }

  _renderAccountGrid() {
    const grid = document.getElementById('slotsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const slotMap = accountsStore.getSlotMap();

    for (let i = 0; i < GRID_SLOTS; i++) {
      const acct = slotMap[i];
      const card = document.createElement('div');

      if (acct) {
        const isLegacy = !acct.avatar;
        card.className = `slot-card filled ${isLegacy ? 'legacy' : ''} ${acct.lockedToday ? 'locked' : ''}`;
        card.innerHTML = `
          <div class="slot-avatar-circle">
            ${acct.name.charAt(0).toUpperCase()}
          </div>
          <div class="slot-name">${acct.name}</div>
          <div class="slot-meta">
            <span class="age-badge ${acct.ageGroup}">${acct.ageGroup}</span>
            <span>${Math.floor(acct.remainingSeconds / 60)}m left</span>
          </div>
        `;

        card.addEventListener('click', () => {
          soundFX.playClick();
          this.selectedAccount = acct;
          document.getElementById('loginAccountNameDisplay').textContent = acct.name;
          document.getElementById('loginPinInput').value = '';
          document.getElementById('pinLoginError').hidden = true;
          this._showWelcomeView('pin');
          document.getElementById('loginPinInput').focus();
        });
      } else {
        card.className = 'slot-card empty';
        card.innerHTML = `
          <div class="slot-avatar-circle">+</div>
          <div class="slot-name" style="color: var(--text-muted); font-size: 13px;">New Pilot</div>
          <div class="slot-meta"><span>Slot ${i + 1}</span></div>
        `;

        card.addEventListener('click', () => {
          soundFX.playClick();
          this.pendingSlot = i;
          document.getElementById('createNameInput').value = '';
          document.getElementById('createPinInput').value = '';
          document.getElementById('createAccountError').hidden = true;
          this._showWelcomeView('create');
          document.getElementById('createNameInput').focus();
        });
      }

      grid.appendChild(card);
    }
  }

  showWelcomeScreen() {
    this._showWelcomeView('grid');
    const overlay = document.getElementById('welcomeScreenOverlay');
    if (overlay) overlay.classList.add('active');
  }

  hideWelcomeScreen() {
    const overlay = document.getElementById('welcomeScreenOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  spawnPilot(account) {
    this.despawnPilot();

    // Create 3D Avatar
    const avatarData = AvatarBuilder.create(account.avatar);
    this.currentCharacter = avatarData.root;
    this.currentRig = avatarData.rig;

    // Spawn at center plaza
    this.currentCharacter.position.set(0, 0, 0);
    this.sceneManager.scene.add(this.currentCharacter);

    // Create Animator & Controller
    this.currentAnimator = new CharacterAnimator(this.currentRig, soundFX);
    this.controller = new CharacterController(
      this.currentCharacter,
      this.currentRig,
      this.currentAnimator,
      this.sceneManager.camera,
      this.canvas,
      soundFX
    );

    // Attach 3D Name Tag billboard
    this.controller.attachNameTag(account.name, account.ageGroup);

    this._updateHUD();
  }

  despawnPilot() {
    if (this.currentCharacter) {
      this.sceneManager.scene.remove(this.currentCharacter);
      this.currentCharacter = null;
      this.currentRig = null;
      this.currentAnimator = null;
      this.controller = null;
    }
  }

  _initHubModals() {
    const modal = document.getElementById('hubModal');
    const closeBtn = document.getElementById('hubModalCloseBtn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        soundFX.playClick();
        modal.classList.remove('active');
      });
    }

    // Proximity interaction prompt [E]
    const prompt = document.getElementById('interactPrompt');
    const triggerHubAction = async () => {
      if (!this.activeHub || !accountsStore.currentPilot) return;

      const id = this.activeHub.id;
      if (id === 'roblox') {
        soundFX.playPortalEnter();
        this.showToast('🚀 Launching Roblox Directly on PC...');
        try {
          if (window.kioskAPI && window.kioskAPI.launchRoblox) {
            await window.kioskAPI.launchRoblox();
          } else {
            await fetch('/api/launch/roblox', { method: 'POST' });
          }
        } catch (e) {
          window.location.href = 'roblox://';
        }
      } else if (id === 'minecraft') {
        soundFX.playPortalEnter();
        this.showToast('⛏️ Launching Minecraft Directly on PC...');
        try {
          if (window.kioskAPI && window.kioskAPI.launchMinecraft) {
            await window.kioskAPI.launchMinecraft();
          } else {
            await fetch('/api/launch/minecraft', { method: 'POST' });
          }
        } catch (e) {
          window.location.href = 'minecraft://';
        }
      } else if (id === 'youtube') {
        YouTubeHub.open(accountsStore.currentPilot, soundFX);
      } else if (id === 'space-typing') {
        SpaceTypingHub.open(accountsStore.currentPilot, soundFX, (pts) => {
          accountsStore.currentPilot.weeklySeconds = (accountsStore.currentPilot.weeklySeconds || 0) + 120;
        });
      } else if (id === 'web-explorer') {
        WebExplorerHub.open(accountsStore.currentPilot, soundFX);
      } else if (id === 'leaderboard') {
        LeaderboardHub.open(accountsStore, soundFX);
      } else if (id === 'wardrobe') {
        this.creatorStudio.open(accountsStore.currentPilot, false);
      } else if (id === 'admin') {
        AdminHub.open(accountsStore, soundFX);
      }
    };

    if (prompt) {
      prompt.addEventListener('click', triggerHubAction);
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE' && this.activeHub) {
        triggerHubAction();
      }
    });
  }

  _startLoop() {
    const prompt = document.getElementById('interactPrompt');
    const promptTitle = document.getElementById('interactTitle');
    const promptSub = document.getElementById('interactSub');

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = this.clock.getDelta();

      // Update Scene Environment (Clouds, Sky, Atmosphere)
      this.sceneManager.update(delta);

      // Update Character Controller & Physics
      if (this.controller) {
        this.controller.update(delta, this.skyIsland.islandRadius);
      }

      // Update Interactive Hubs & Proximity
      const playerPos = this.currentCharacter ? this.currentCharacter.position : null;
      const nearestHub = this.hubsManager.update(delta, playerPos);
      this.activeHub = nearestHub;

      // Update Proximity Prompt HUD
      if (nearestHub && prompt && promptTitle && promptSub) {
        promptTitle.textContent = nearestHub.name;
        promptSub.textContent = nearestHub.sub;
        prompt.classList.add('visible');
      } else if (prompt) {
        prompt.classList.remove('visible');
      }

      // Render Scene
      this.sceneManager.render();
    };

    animate();
  }

  showToast(msg) {
    let toast = document.getElementById('kioskHudToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'kioskHudToast';
      toast.style.position = 'fixed';
      toast.style.top = '85px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(10, 15, 29, 0.95)';
      toast.style.border = '2px solid #00f2fe';
      toast.style.borderRadius = '9999px';
      toast.style.padding = '12px 28px';
      toast.style.color = '#ffffff';
      toast.style.fontFamily = 'Space Grotesk, sans-serif';
      toast.style.fontWeight = '800';
      toast.style.fontSize = '16px';
      toast.style.boxShadow = '0 0 30px rgba(0, 242, 254, 0.5)';
      toast.style.zIndex = '9999';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.visibility = 'visible';

    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        toast.style.visibility = 'hidden';
      }
    }, 4000);
  }
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
