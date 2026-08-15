// 3D Character Creator Studio Controller (Optimized with Selective Rendering)
import * as THREE from 'three';
import { AvatarBuilder, DEFAULT_AVATAR } from './avatar-builder.js';
import { CharacterAnimator } from './character-animator.js';

export class CharacterCreatorStudio {
  constructor(canvasContainer, onSaveCallback, soundFX = null) {
    this.container = canvasContainer;
    this.onSave = onSaveCallback;
    this.soundFX = soundFX;

    this.currentConfig = { ...DEFAULT_AVATAR };
    this.currentAccount = null;
    this.currentAge = 10;
    this.activeTab = 'body';

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.avatarRig = null;
    this.animator = null;
    this.pedestal = null;

    this.isOpen = false;
    this.animFrameId = null;
    this.autoRotate = true;
    this.isDragging = false;
    this.prevMouseX = 0;
    this.clock = new THREE.Clock();

    this._initThreeScene();
    this._initUIEvents();
  }

  _initThreeScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Studio Camera
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(0, 1.2, 4.2);
    this.camera.lookAt(0, 0.9, 0);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f2fe, 2.4);
    keyLight.position.set(3, 4, 3);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9333ea, 1.8);
    fillLight.position.set(-3, 2, -2);
    this.scene.add(fillLight);

    const topLight = new THREE.PointLight(0xffffff, 1.8, 10);
    topLight.position.set(0, 3.5, 0);
    this.scene.add(topLight);

    // Rotating Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.25, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2
    });
    this.pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    this.pedestal.position.y = -0.12;

    const ringGeo = new THREE.TorusGeometry(1.22, 0.03, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.12;
    this.pedestal.add(ring);

    this.scene.add(this.pedestal);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(400, 400);

    const previewBox = document.getElementById('creatorPreviewCanvas');
    if (previewBox) {
      previewBox.appendChild(this.renderer.domElement);
    }

    // Drag to rotate character
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.prevMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.avatarRig) return;
      const deltaX = e.clientX - this.prevMouseX;
      this.prevMouseX = e.clientX;
      this.avatarRig.root.rotation.y += deltaX * 0.015;
    });

    this._rebuildAvatar();
  }

  _rebuildAvatar() {
    if (this.avatarRig) {
      this.scene.remove(this.avatarRig.root);
    }

    this.avatarRig = AvatarBuilder.create(this.currentConfig);
    this.scene.add(this.avatarRig.root);
    this.animator = new CharacterAnimator(this.avatarRig.rig, this.soundFX);
  }

  _animate() {
    if (!this.isOpen) return;

    this.animFrameId = requestAnimationFrame(() => this._animate());

    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (this.avatarRig && this.autoRotate) {
      this.avatarRig.root.rotation.y += 0.012;
    }

    if (this.animator) {
      this.animator.update(delta, 0, true);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  open(account, isLegacyPrompt = false) {
    this.isOpen = true;
    this.currentAccount = account;
    this.currentAge = account.age || 10;
    this.currentConfig = account.avatar ? { ...account.avatar } : { ...DEFAULT_AVATAR };

    const overlay = document.getElementById('characterCreatorOverlay');
    if (overlay) {
      overlay.classList.add('active');
    }

    const legacyBadge = document.getElementById('creatorLegacyBadge');
    if (legacyBadge) {
      legacyBadge.hidden = !isLegacyPrompt;
    }

    const pilotTitle = document.getElementById('creatorPilotName');
    if (pilotTitle) {
      pilotTitle.textContent = `${account.name}'s Avatar Studio`;
    }

    this._syncAgeUI();
    this._renderCurrentTab();
    this._rebuildAvatar();
    this._resizePreview();

    // Start render loop
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.clock.start();
    this._animate();
  }

  close() {
    this.isOpen = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    const overlay = document.getElementById('characterCreatorOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  _resizePreview() {
    const previewBox = document.getElementById('creatorPreviewCanvas');
    if (previewBox && this.renderer && this.camera) {
      const width = previewBox.clientWidth;
      const height = previewBox.clientHeight;
      if (width > 0 && height > 0) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    }
  }

  _initUIEvents() {
    window.addEventListener('resize', () => {
      if (this.isOpen) this._resizePreview();
    });

    // Category Tabs
    document.querySelectorAll('.creator-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.creator-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
    });

    // Age Buttons
    const childBtn = document.getElementById('ageOptionChild');
    const teenBtn = document.getElementById('ageOptionTeen');

    if (childBtn && teenBtn) {
      childBtn.addEventListener('click', () => {
        this.currentAge = 9;
        this._syncAgeUI();
        if (this.soundFX) this.soundFX.playClick();
      });

      teenBtn.addEventListener('click', () => {
        this.currentAge = 14;
        this._syncAgeUI();
        if (this.soundFX) this.soundFX.playClick();
      });
    }

    // Animation preview toggle
    const animDance = document.getElementById('animDanceBtn');
    const animWave = document.getElementById('animWaveBtn');
    const animIdle = document.getElementById('animIdleBtn');

    if (animDance) {
      animDance.addEventListener('click', () => {
        if (this.animator) this.animator.setState('dance');
        if (this.soundFX) this.soundFX.playClick();
      });
    }
    if (animWave) {
      animWave.addEventListener('click', () => {
        if (this.animator) this.animator.setState('wave');
        if (this.soundFX) this.soundFX.playClick();
      });
    }
    if (animIdle) {
      animIdle.addEventListener('click', () => {
        if (this.animator) this.animator.setState('idle');
        if (this.soundFX) this.soundFX.playClick();
      });
    }

    // Randomize Button
    const randomBtn = document.getElementById('randomizeAvatarBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        this._randomize();
        if (this.soundFX) this.soundFX.playScore();
      });
    }

    // Save & Spawn Button
    const saveBtn = document.getElementById('saveAvatarBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (this.soundFX) this.soundFX.playPortalEnter();
        this.close();
        if (this.onSave) {
          this.onSave(this.currentAccount.id, this.currentConfig, this.currentAge);
        }
      });
    }
  }

  _syncAgeUI() {
    const isTeen = this.currentAge >= 13;
    const childBtn = document.getElementById('ageOptionChild');
    const teenBtn = document.getElementById('ageOptionTeen');

    if (childBtn && teenBtn) {
      childBtn.classList.toggle('active', !isTeen);
      teenBtn.classList.toggle('active', isTeen);
    }
  }

  _randomize() {
    const skinTones = ['#ffd1a4', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'];
    const hairStyles = ['spiky', 'ponytail', 'cap', 'crown', 'astronaut', 'headphones'];
    const hairColors = ['#1e293b', '#e2e8f0', '#f59e0b', '#ef4444', '#00f2fe', '#ec4899', '#10b981', '#9333ea'];
    const faceTypes = ['happy', 'cool', 'vr', 'classic'];
    const outfitTypes = ['hoodie', 'cyber', 'space', 'knight'];
    const primaryColors = ['#00f2fe', '#3b82f6', '#9333ea', '#ec4899', '#ef4444', '#10b981', '#f59e0b'];
    const backGears = ['wings', 'jetpack', 'cape', 'katana', 'halo', 'none'];

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    this.currentConfig = {
      skinColor: pick(skinTones),
      hairStyle: pick(hairStyles),
      hairColor: pick(hairColors),
      faceType: pick(faceTypes),
      outfitType: pick(outfitTypes),
      primaryColor: pick(primaryColors),
      secondaryColor: '#0f172a',
      backGear: pick(backGears),
      accessoryColor: pick(primaryColors)
    };

    this._rebuildAvatar();
    this._renderCurrentTab();
  }

  _renderCurrentTab() {
    const content = document.getElementById('creatorPanelContent');
    if (!content) return;
    content.innerHTML = '';

    if (this.activeTab === 'body') {
      this._renderBodyTab(content);
    } else if (this.activeTab === 'hair') {
      this._renderHairTab(content);
    } else if (this.activeTab === 'face') {
      this._renderFaceTab(content);
    } else if (this.activeTab === 'outfit') {
      this._renderOutfitTab(content);
    } else if (this.activeTab === 'gear') {
      this._renderGearTab(content);
    } else if (this.activeTab === 'presets') {
      this._renderPresetsTab(content);
    }
  }

  _renderBodyTab(container) {
    const skinSection = document.createElement('div');
    skinSection.className = 'creator-section';
    skinSection.innerHTML = `<div class="creator-section-title">🎨 Skin Tone</div>`;

    const swatches = document.createElement('div');
    swatches.className = 'color-swatches-grid';

    const tones = ['#ffd1a4', '#ffdbac', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#5c3836', '#3b2219'];
    tones.forEach(color => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (this.currentConfig.skinColor === color ? ' active' : '');
      sw.style.backgroundColor = color;
      sw.addEventListener('click', () => {
        this.currentConfig.skinColor = color;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      swatches.appendChild(sw);
    });
    skinSection.appendChild(swatches);
    container.appendChild(skinSection);
  }

  _renderHairTab(container) {
    const styleSection = document.createElement('div');
    styleSection.className = 'creator-section';
    styleSection.innerHTML = `<div class="creator-section-title">💇 Hairstyle & Headgear</div>`;

    const grid = document.createElement('div');
    grid.className = 'options-grid';

    const styles = [
      { id: 'spiky', name: 'Spiky Anime', icon: '⚡' },
      { id: 'ponytail', name: 'Ponytail', icon: '🎀' },
      { id: 'cap', name: 'Gamer Cap', icon: '🧢' },
      { id: 'headphones', name: 'RGB Headset', icon: '🎧' },
      { id: 'crown', name: 'King Crown', icon: '👑' },
      { id: 'astronaut', name: 'Space Helmet', icon: '🧑‍🚀' }
    ];

    styles.forEach(s => {
      const card = document.createElement('div');
      card.className = 'option-card' + (this.currentConfig.hairStyle === s.id ? ' active' : '');
      card.innerHTML = `<span class="option-icon">${s.icon}</span><span class="option-name">${s.name}</span>`;
      card.addEventListener('click', () => {
        this.currentConfig.hairStyle = s.id;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      grid.appendChild(card);
    });
    styleSection.appendChild(grid);
    container.appendChild(styleSection);

    const colorSection = document.createElement('div');
    colorSection.className = 'creator-section';
    colorSection.innerHTML = `<div class="creator-section-title">🎨 Hair / Hat Color</div>`;

    const swatches = document.createElement('div');
    swatches.className = 'color-swatches-grid';
    const hairColors = ['#0f172a', '#f59e0b', '#ef4444', '#00f2fe', '#9333ea', '#ec4899', '#10b981', '#e2e8f0'];
    hairColors.forEach(c => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (this.currentConfig.hairColor === c ? ' active' : '');
      sw.style.backgroundColor = c;
      sw.addEventListener('click', () => {
        this.currentConfig.hairColor = c;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      swatches.appendChild(sw);
    });
    colorSection.appendChild(swatches);
    container.appendChild(colorSection);
  }

  _renderFaceTab(container) {
    const faceSection = document.createElement('div');
    faceSection.className = 'creator-section';
    faceSection.innerHTML = `<div class="creator-section-title">😎 Face & Visor</div>`;

    const grid = document.createElement('div');
    grid.className = 'options-grid';

    const faces = [
      { id: 'happy', name: 'Happy Smile', icon: '😄' },
      { id: 'cool', name: 'Cool Shades', icon: '🕶️' },
      { id: 'vr', name: 'Cyber VR Visor', icon: '🥽' },
      { id: 'classic', name: 'Pixel Gamer', icon: '🎮' }
    ];

    faces.forEach(f => {
      const card = document.createElement('div');
      card.className = 'option-card' + (this.currentConfig.faceType === f.id ? ' active' : '');
      card.innerHTML = `<span class="option-icon">${f.icon}</span><span class="option-name">${f.name}</span>`;
      card.addEventListener('click', () => {
        this.currentConfig.faceType = f.id;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      grid.appendChild(card);
    });
    faceSection.appendChild(grid);
    container.appendChild(faceSection);
  }

  _renderOutfitTab(container) {
    const outfitSection = document.createElement('div');
    outfitSection.className = 'creator-section';
    outfitSection.innerHTML = `<div class="creator-section-title">👕 Outfit Theme</div>`;

    const grid = document.createElement('div');
    grid.className = 'options-grid';

    const outfits = [
      { id: 'hoodie', name: 'Gamer Hoodie', icon: '🧥' },
      { id: 'cyber', name: 'Cyber Suit', icon: '⚡' },
      { id: 'space', name: 'Space Suit', icon: '🚀' },
      { id: 'knight', name: 'Knight Armor', icon: '🛡️' }
    ];

    outfits.forEach(o => {
      const card = document.createElement('div');
      card.className = 'option-card' + (this.currentConfig.outfitType === o.id ? ' active' : '');
      card.innerHTML = `<span class="option-icon">${o.icon}</span><span class="option-name">${o.name}</span>`;
      card.addEventListener('click', () => {
        this.currentConfig.outfitType = o.id;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      grid.appendChild(card);
    });
    outfitSection.appendChild(grid);
    container.appendChild(outfitSection);

    const primarySection = document.createElement('div');
    primarySection.className = 'creator-section';
    primarySection.innerHTML = `<div class="creator-section-title">🎨 Primary Outfit Color</div>`;

    const swatches = document.createElement('div');
    swatches.className = 'color-swatches-grid';
    const colors = ['#00f2fe', '#3b82f6', '#9333ea', '#ec4899', '#ef4444', '#10b981', '#f59e0b', '#0f172a'];
    colors.forEach(c => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (this.currentConfig.primaryColor === c ? ' active' : '');
      sw.style.backgroundColor = c;
      sw.addEventListener('click', () => {
        this.currentConfig.primaryColor = c;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      swatches.appendChild(sw);
    });
    primarySection.appendChild(swatches);
    container.appendChild(primarySection);
  }

  _renderGearTab(container) {
    const gearSection = document.createElement('div');
    gearSection.className = 'creator-section';
    gearSection.innerHTML = `<div class="creator-section-title">✨ Back Gear & Wings</div>`;

    const grid = document.createElement('div');
    grid.className = 'options-grid';

    const gears = [
      { id: 'wings', name: 'Dragon Wings', icon: '🐉' },
      { id: 'jetpack', name: 'Flame Jetpack', icon: '🚀' },
      { id: 'cape', name: 'Hero Cape', icon: '🦸' },
      { id: 'katana', name: 'Cyber Blade', icon: '⚔️' },
      { id: 'halo', name: 'Angel Halo', icon: '😇' },
      { id: 'none', name: 'No Gear', icon: '🚫' }
    ];

    gears.forEach(g => {
      const card = document.createElement('div');
      card.className = 'option-card' + (this.currentConfig.backGear === g.id ? ' active' : '');
      card.innerHTML = `<span class="option-icon">${g.icon}</span><span class="option-name">${g.name}</span>`;
      card.addEventListener('click', () => {
        this.currentConfig.backGear = g.id;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      grid.appendChild(card);
    });
    gearSection.appendChild(grid);
    container.appendChild(gearSection);

    const glowSection = document.createElement('div');
    glowSection.className = 'creator-section';
    glowSection.innerHTML = `<div class="creator-section-title">✨ Accessory & Glow Color</div>`;

    const swatches = document.createElement('div');
    swatches.className = 'color-swatches-grid';
    const glowColors = ['#ec4899', '#00f2fe', '#9333ea', '#f59e0b', '#10b981', '#ef4444'];
    glowColors.forEach(c => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (this.currentConfig.accessoryColor === c ? ' active' : '');
      sw.style.backgroundColor = c;
      sw.addEventListener('click', () => {
        this.currentConfig.accessoryColor = c;
        this._rebuildAvatar();
        this._renderCurrentTab();
        if (this.soundFX) this.soundFX.playClick();
      });
      swatches.appendChild(sw);
    });
    glowSection.appendChild(swatches);
    container.appendChild(glowSection);
  }

  _renderPresetsTab(container) {
    const presetsSection = document.createElement('div');
    presetsSection.className = 'creator-section';
    presetsSection.innerHTML = `<div class="creator-section-title">⭐ Preset Styles</div>`;

    const grid = document.createElement('div');
    grid.className = 'presets-grid';

    const presets = [
      {
        title: 'Cyber Runner',
        sub: 'Neon visor & wings',
        icon: '⚡',
        cfg: {
          skinColor: '#ffd1a4',
          hairStyle: 'spiky',
          hairColor: '#00f2fe',
          faceType: 'vr',
          outfitType: 'cyber',
          primaryColor: '#00f2fe',
          secondaryColor: '#0f172a',
          backGear: 'wings',
          accessoryColor: '#ec4899'
        }
      },
      {
        title: 'Space Ace',
        sub: 'Booster jetpack & helmet',
        icon: '🚀',
        cfg: {
          skinColor: '#f1c27d',
          hairStyle: 'astronaut',
          hairColor: '#e2e8f0',
          faceType: 'happy',
          outfitType: 'space',
          primaryColor: '#3b82f6',
          secondaryColor: '#0f172a',
          backGear: 'jetpack',
          accessoryColor: '#00f2fe'
        }
      },
      {
        title: 'Arcade Champion',
        sub: 'Cool shades & cape',
        icon: '👑',
        cfg: {
          skinColor: '#ffdbac',
          hairStyle: 'crown',
          hairColor: '#f59e0b',
          faceType: 'cool',
          outfitType: 'hoodie',
          primaryColor: '#f59e0b',
          secondaryColor: '#0f172a',
          backGear: 'cape',
          accessoryColor: '#f59e0b'
        }
      },
      {
        title: 'Ninja Knight',
        sub: 'Katana & armor plate',
        icon: '⚔️',
        cfg: {
          skinColor: '#e0ac69',
          hairStyle: 'spiky',
          hairColor: '#0f172a',
          faceType: 'classic',
          outfitType: 'knight',
          primaryColor: '#9333ea',
          secondaryColor: '#0f172a',
          backGear: 'katana',
          accessoryColor: '#c084fc'
        }
      }
    ];

    presets.forEach(p => {
      const card = document.createElement('div');
      card.className = 'preset-card';
      card.innerHTML = `
        <span class="preset-icon">${p.icon}</span>
        <div>
          <div class="preset-title">${p.title}</div>
          <div class="preset-subtitle">${p.sub}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        this.currentConfig = { ...p.cfg };
        this._rebuildAvatar();
        if (this.soundFX) this.soundFX.playScore();
      });
      grid.appendChild(card);
    });

    presetsSection.appendChild(grid);
    container.appendChild(presetsSection);
  }
}
