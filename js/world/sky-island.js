// Textured Floating Sky Island & Celestial Cascades (Procedural Canvas Textures for High Visual Fidelity)
import * as THREE from 'three';

// --- Procedural Canvas Texture Generators ---
function createIslandGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Base emerald meadow gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#10b981');
  grad.addColorStop(0.5, '#059669');
  grad.addColorStop(1, '#047857');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Subtle turf stippling & blade noise
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const shade = Math.random() > 0.5 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(6, 78, 59, 0.4)';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

function createPathwayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark slate paver base
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 256);

  // Tile grid seams
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;

  const tileSize = 64;
  for (let x = 0; x < 256; x += tileSize) {
    for (let y = 0; y < 256; y += tileSize) {
      // Paver gradient
      const pGrad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
      pGrad.addColorStop(0, '#334155');
      pGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = pGrad;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  // Micro-grit
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  return texture;
}

function createPlazaPaverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 256);

  // Radial titanium rings
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  for (let r = 20; r < 128; r += 20) {
    ctx.beginPath();
    ctx.arc(128, 128, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cross radial seams
  for (let a = 0; a < 8; a++) {
    const angle = (a / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(128 + Math.cos(angle) * 128, 128 + Math.sin(angle) * 128);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createRockStrataTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 256, 256);

  // Horizontal geological strata
  for (let y = 0; y < 256; y += 8) {
    const shade = Math.random() > 0.5 ? '#1e293b' : '#0f172a';
    ctx.fillStyle = shade;
    ctx.fillRect(0, y, 256, Math.random() * 6 + 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createWaterfallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Crystal cyan base
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, 'rgba(0, 242, 254, 0.85)');
  grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.75)');
  grad.addColorStop(1, 'rgba(2, 132, 199, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  // White foam flow vertical streaks
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 256;
    const h = Math.random() * 40 + 15;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(x, y, Math.random() * 2 + 1, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export class SkyIsland {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'SkyIsland';
    this.islandRadius = 38;

    this.waterfallTextures = [];

    this._buildMainIsland();
    this._buildPathways();
    this._buildSkyIslandsAndCascades();

    this.scene.add(this.root);
  }

  _buildMainIsland() {
    const grassTex = createIslandGrassTexture();
    const rockTex = createRockStrataTexture();
    const plazaTex = createPlazaPaverTexture();

    // 1. Grassy Plateau Top Surface (Y = 0)
    const topGeo = new THREE.CylinderGeometry(this.islandRadius, this.islandRadius + 1.8, 2.8, 48);
    const topMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.65,
      metalness: 0.05
    });

    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = -1.4;
    topMesh.receiveShadow = true;
    this.root.add(topMesh);

    // 2. Stratified Rock Island Underbelly
    const rockGeo = new THREE.ConeGeometry(this.islandRadius + 1.8, 36, 24);
    const rockMat = new THREE.MeshStandardMaterial({
      map: rockTex,
      roughness: 0.85,
      metalness: 0.2,
      flatShading: true
    });

    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -20.5;
    this.root.add(rockMesh);

    // 3. Central Quantum Plaza (Titanium Paver)
    const plazaGeo = new THREE.CylinderGeometry(9.5, 9.5, 0.1, 32);
    const plazaMat = new THREE.MeshStandardMaterial({
      map: plazaTex,
      roughness: 0.35,
      metalness: 0.7
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.y = 0.05;
    plaza.receiveShadow = true;
    this.root.add(plaza);

    // Double Glowing Energy Rings in Plaza
    const innerRingGeo = new THREE.TorusGeometry(8.5, 0.14, 12, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.1;
    this.root.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(9.2, 0.08, 12, 48);
    const purpleRingMat = new THREE.MeshBasicMaterial({ color: 0x9333ea });
    const outerRing = new THREE.Mesh(outerRingGeo, purpleRingMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.1;
    this.root.add(outerRing);
  }

  _buildPathways() {
    const pathTex = createPathwayTexture();
    const pathMat = new THREE.MeshStandardMaterial({
      map: pathTex,
      roughness: 0.5,
      metalness: 0.35
    });

    const neonStripeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });

    const hubAngles = [
      0,                     // Roblox Hub (East)
      (50 * Math.PI) / 180,  // Minecraft Hub
      (110 * Math.PI) / 180, // Space Typing Arcade
      (170 * Math.PI) / 180, // YouTube Hub
      (230 * Math.PI) / 180, // Web Explorer
      (280 * Math.PI) / 180, // Leaderboard Shrine
      (330 * Math.PI) / 180  // Wardrobe Stylist
    ];

    const pathGeo = new THREE.BoxGeometry(3.6, 0.08, 17.5);
    const stripeGeo = new THREE.BoxGeometry(0.12, 0.09, 17.5);

    hubAngles.forEach(angle => {
      const midDist = 18.25;
      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.receiveShadow = true;
      pathMesh.position.set(
        Math.sin(angle) * midDist,
        0.04,
        Math.cos(angle) * midDist
      );
      pathMesh.rotation.y = angle;
      this.root.add(pathMesh);

      const stripe = new THREE.Mesh(stripeGeo, neonStripeMat);
      stripe.position.set(
        Math.sin(angle) * midDist,
        0.05,
        Math.cos(angle) * midDist
      );
      stripe.rotation.y = angle;
      this.root.add(stripe);
    });
  }

  _buildSkyIslandsAndCascades() {
    const skyIslandsData = [
      { skyX: 20, skyY: 22, skyZ: -16, radius: 6.5, color: 0x38bdf8 },
      { skyX: -22, skyY: 26, skyZ: -14, radius: 7.0, color: 0x00f2fe },
      { skyX: -18, skyY: 20, skyZ: 22, radius: 6.0, color: 0x60a5fa },
      { skyX: 22, skyY: 24, skyZ: 18, radius: 6.8, color: 0x00f2fe }
    ];

    const grassTex = createIslandGrassTexture();
    const rockTex = createRockStrataTexture();

    const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.7 });
    const rockMat = new THREE.MeshStandardMaterial({ map: rockTex, roughness: 0.85, flatShading: true });
    const poolWaterMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 });
    const splashMistMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });

    skyIslandsData.forEach((isl, idx) => {
      const islandGroup = new THREE.Group();
      islandGroup.position.set(isl.skyX, isl.skyY, isl.skyZ);

      // Upper Island Top Surface
      const topGeo = new THREE.CylinderGeometry(isl.radius, isl.radius + 1.0, 1.8, 20);
      const topMesh = new THREE.Mesh(topGeo, grassMat);
      islandGroup.add(topMesh);

      // Upper Island Rock Underbelly
      const rockGeo = new THREE.ConeGeometry(isl.radius + 1.0, 9.0, 16);
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.rotation.x = Math.PI;
      rockMesh.position.y = -5.0;
      islandGroup.add(rockMesh);

      // Celestial Spring Pool on Upper Island
      const springGeo = new THREE.CylinderGeometry(isl.radius * 0.55, isl.radius * 0.55, 0.2, 16);
      const springMesh = new THREE.Mesh(springGeo, poolWaterMat);
      springMesh.position.y = 0.95;
      islandGroup.add(springMesh);

      // Floating Crystal Power Core above spring
      const crystalGeo = new THREE.OctahedronGeometry(1.4, 0);
      const crystalMat = new THREE.MeshBasicMaterial({ color: isl.color });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 3.4;
      islandGroup.add(crystal);

      this.root.add(islandGroup);

      // 🌊 Cascading Waterfall with Textured Flow Curtains
      const fallTex = createWaterfallTexture();
      this.waterfallTextures.push(fallTex);

      const waterMat = new THREE.MeshBasicMaterial({
        map: fallTex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });

      const fallHeight = isl.skyY - 0.2;
      const fallWidth = 2.4;
      const fallGeo = new THREE.PlaneGeometry(fallWidth, fallHeight, 4, 12);
      const fallMesh = new THREE.Mesh(fallGeo, waterMat);

      fallMesh.position.set(isl.skyX + isl.radius * 0.7, fallHeight / 2, isl.skyZ);
      fallMesh.rotation.y = idx % 2 === 0 ? Math.PI / 4 : -Math.PI / 4;
      this.root.add(fallMesh);

      const fallMesh2 = new THREE.Mesh(fallGeo, waterMat);
      fallMesh2.position.set(isl.skyX + isl.radius * 0.7, fallHeight / 2, isl.skyZ);
      fallMesh2.rotation.y = (idx % 2 === 0 ? Math.PI / 4 : -Math.PI / 4) + Math.PI / 2;
      this.root.add(fallMesh2);

      // Splash Pool on Main Island Ground
      const splashPoolGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.12, 18);
      const splashPool = new THREE.Mesh(splashPoolGeo, poolWaterMat);
      splashPool.position.set(isl.skyX + isl.radius * 0.7, 0.08, isl.skyZ);
      this.root.add(splashPool);

      // Splash Pool Border
      const borderGeo = new THREE.TorusGeometry(3.3, 0.2, 8, 20);
      const borderMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.rotation.x = Math.PI / 2;
      border.position.set(isl.skyX + isl.radius * 0.7, 0.12, isl.skyZ);
      this.root.add(border);

      // Foam Splash Mist Ring
      const foamGeo = new THREE.RingGeometry(1.2, 2.8, 16);
      const foam = new THREE.Mesh(foamGeo, splashMistMat);
      foam.rotation.x = -Math.PI / 2;
      foam.position.set(isl.skyX + isl.radius * 0.7, 0.15, isl.skyZ);
      this.root.add(foam);
    });
  }

  update(delta) {
    // Animate waterfall texture flow
    for (let i = 0; i < this.waterfallTextures.length; i++) {
      this.waterfallTextures[i].offset.y -= delta * 0.65;
    }
  }
}
