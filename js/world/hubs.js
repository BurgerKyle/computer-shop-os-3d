// 100% Authentic Replica 3D Models for Computer Shop OS Hubs
// Features: Pixel-Exact Minecraft Grass Block (16x16 Canvas Textures with NearestFilter), Exact R6 Robloxian, YouTube Play Button, and Esports Trophy
import * as THREE from 'three';

// --- Procedural 16x16 Pixel Texture Generators ---
function createMinecraftGrassTopTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  const greens = ['#5b8731', '#4c7823', '#3e6919', '#6a9a3b', '#75a843', '#55802e', '#487224', '#629035'];

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(Math.random() * greens.length);
      ctx.fillStyle = greens[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createMinecraftGrassSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  const dirts = ['#866043', '#724f35', '#573d26', '#9c6e4c', '#402c19', '#6b4931', '#7b5539'];
  const greens = ['#5b8731', '#4c7823', '#3e6919', '#6a9a3b', '#75a843', '#55802e'];

  // Fill dirt base
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(Math.random() * dirts.length);
      ctx.fillStyle = dirts[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Draw iconic jagged Minecraft grass drops on top (top 2 to 5 pixels)
  const dropPattern = [3, 4, 2, 5, 4, 3, 2, 4, 5, 3, 2, 4, 3, 5, 4, 2];
  for (let x = 0; x < 16; x++) {
    const depth = dropPattern[x];
    for (let y = 0; y < depth; y++) {
      const idx = Math.floor(Math.random() * greens.length);
      ctx.fillStyle = greens[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function createMinecraftDirtBottomTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  const dirts = ['#866043', '#724f35', '#573d26', '#9c6e4c', '#402c19', '#6b4931', '#7b5539'];

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = Math.floor(Math.random() * dirts.length);
      ctx.fillStyle = dirts[idx];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

// Iconic Roblox Classic Smiley Face Texture
function createRobloxFaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Fill yellow skin background
  ctx.fillStyle = '#F5CD2F';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#111827';

  // Left Eye (Classic Roblox Black Oval)
  ctx.beginPath();
  ctx.ellipse(38, 52, 7, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Right Eye (Classic Roblox Black Oval)
  ctx.beginPath();
  ctx.ellipse(90, 52, 7, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Classic Roblox Wide Smile
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#111827';
  ctx.beginPath();
  ctx.arc(64, 72, 30, 0.15 * Math.PI, 0.85 * Math.PI, false);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export class HubsManager {
  constructor(scene) {
    this.scene = scene;
    this.hubs = [];
    this.activeHub = null;

    this._buildAllHubs();
  }

  _buildAllHubs() {
    // 1. Roblox Hub - Authentic Classic R6 Robloxian Avatar (East, 0°)
    this._createRobloxStatueHub(26, 0, 0);

    // 2. Minecraft Hub - Pixel-Perfect Minecraft Grass Block (50°)
    const mcAngle = (50 * Math.PI) / 180;
    this._createMinecraftGrassBlockHub(Math.sin(mcAngle) * 26, 0, Math.cos(mcAngle) * 26);

    // 3. Space Typing Hub - Giant Neon Arcade Cabinet (110°)
    const stAngle = (110 * Math.PI) / 180;
    this._createSpaceTypingHub(Math.sin(stAngle) * 26, 0, Math.cos(stAngle) * 26);

    // 4. YouTube Hub - Giant YouTube Play Button (170°)
    const ytAngle = (170 * Math.PI) / 180;
    this._createYouTubePlayButtonHub(Math.sin(ytAngle) * 26, 0, Math.cos(ytAngle) * 26);

    // 5. Web Explorer - Dyson Web Observatory (230°)
    const webAngle = (230 * Math.PI) / 180;
    this._createWebExplorerHub(Math.sin(webAngle) * 26, 0, Math.cos(webAngle) * 26);

    // 6. Hall of Fame - Giant Gold Championship Trophy (280°)
    const lbAngle = (280 * Math.PI) / 180;
    this._createHallOfFameTrophyHub(Math.sin(lbAngle) * 26, 0, Math.cos(lbAngle) * 26);

    // 7. Wardrobe Stylist Pavilion (330°)
    const wardAngle = (330 * Math.PI) / 180;
    this._createWardrobeHub(Math.sin(wardAngle) * 26, 0, Math.cos(wardAngle) * 26);

    // 8. Kuya Ricky Operations Command (Center, Z = -4.5)
    this._createAdminCommandStation(0, 0, -4.5);
  }

  // 🎮 1. EXACT REPLICA: AUTHENTIC CLASSIC R6 ROBLOXIAN STATUE
  _createRobloxStatueHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Marble & Slate Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(4.2, 4.6, 0.8, 24);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.4;
    hub.add(pedestal);

    // Red Neon Accent Ring on Pedestal
    const ringGeo = new THREE.TorusGeometry(4.3, 0.1, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.8;
    hub.add(ring);

    // Statue Scale Group
    const statue = new THREE.Group();
    statue.position.y = 0.8;
    statue.scale.set(1.4, 1.4, 1.4);

    // Exact Official Roblox Color Palette
    const yellowSkinMat = new THREE.MeshStandardMaterial({ color: 0xF5CD2F, roughness: 0.25, metalness: 0.05 });
    const blueTorsoMat = new THREE.MeshStandardMaterial({ color: 0x0D69AC, roughness: 0.25, metalness: 0.05 });
    const greenLegsMat = new THREE.MeshStandardMaterial({ color: 0x4B974B, roughness: 0.25, metalness: 0.05 });

    // 1. LEGS (1.0 wide x 2.0 tall x 1.0 deep each, separated by 0.02)
    const legGeo = new THREE.BoxGeometry(1.0, 2.0, 1.0);
    const leftLeg = new THREE.Mesh(legGeo, greenLegsMat);
    leftLeg.position.set(-0.51, 1.0, 0);
    statue.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, greenLegsMat);
    rightLeg.position.set(0.51, 1.0, 0);
    statue.add(rightLeg);

    // 2. TORSO (2.0 wide x 2.0 tall x 1.0 deep)
    const torsoGeo = new THREE.BoxGeometry(2.0, 2.0, 1.0);
    const torso = new THREE.Mesh(torsoGeo, blueTorsoMat);
    torso.position.set(0, 3.0, 0);
    statue.add(torso);

    // Iconic Tilted Roblox "R" Square Logo on Chest
    const logoOuterGeo = new THREE.BoxGeometry(0.75, 0.75, 0.06);
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const logoOuter = new THREE.Mesh(logoOuterGeo, whiteMat);
    logoOuter.rotation.z = Math.PI / 6; // Exactly 30° tilted classic Roblox square
    logoOuter.position.set(0, 3.1, 0.52);
    statue.add(logoOuter);

    const logoInnerGeo = new THREE.BoxGeometry(0.3, 0.3, 0.08);
    const logoInner = new THREE.Mesh(logoInnerGeo, blueTorsoMat);
    logoInner.rotation.z = Math.PI / 6;
    logoInner.position.set(0, 3.1, 0.53);
    statue.add(logoInner);

    // 3. ARMS (1.0 wide x 2.0 tall x 1.0 deep)
    const armGeo = new THREE.BoxGeometry(1.0, 2.0, 1.0);

    // Left Arm (Heroic Raised Wave Stance)
    const leftArm = new THREE.Mesh(armGeo, yellowSkinMat);
    leftArm.position.set(-1.55, 3.1, 0);
    leftArm.rotation.z = 0.25;
    statue.add(leftArm);

    // Right Arm (Holding Blocky Sword)
    const rightArm = new THREE.Mesh(armGeo, yellowSkinMat);
    rightArm.position.set(1.55, 2.9, 0);
    rightArm.rotation.x = -0.3;
    statue.add(rightArm);

    // Blocky Roblox Classic Sword
    const swordHiltGeo = new THREE.BoxGeometry(0.3, 0.15, 0.8);
    const swordHiltMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
    const swordHilt = new THREE.Mesh(swordHiltGeo, swordHiltMat);
    swordHilt.position.set(1.6, 2.3, 0.7);
    statue.add(swordHilt);

    const swordBladeGeo = new THREE.BoxGeometry(0.12, 0.35, 2.4);
    const swordBladeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
    const swordBlade = new THREE.Mesh(swordBladeGeo, swordBladeMat);
    swordBlade.position.set(1.6, 2.3, 1.9);
    statue.add(swordBlade);

    // 4. HEAD (1.25 x 1.25 x 1.25 Cube with Classic Smiley Face Decal)
    const faceTex = createRobloxFaceTexture();
    const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.25 });

    // Multi-material cube: Front face gets the smile texture, other 5 sides get pure yellow skin
    const headMats = [
      yellowSkinMat, // Right
      yellowSkinMat, // Left
      yellowSkinMat, // Top
      yellowSkinMat, // Bottom
      faceMat,       // Front (Smiley Face)
      yellowSkinMat  // Back
    ];

    const headGeo = new THREE.BoxGeometry(1.25, 1.25, 1.25);
    const head = new THREE.Mesh(headGeo, headMats);
    head.position.set(0, 4.65, 0);
    statue.add(head);

    // Iconic Head Stud on Top
    const studGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
    const headStud = new THREE.Mesh(studGeo, yellowSkinMat);
    headStud.position.set(0, 5.4, 0);
    statue.add(headStud);

    // Shoulder Studs (Left & Right)
    const shoulderStudGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 12);
    const leftStud = new THREE.Mesh(shoulderStudGeo, yellowSkinMat);
    leftStud.position.set(-1.55, 4.15, 0);
    statue.add(leftStud);

    const rightStud = new THREE.Mesh(shoulderStudGeo, yellowSkinMat);
    rightStud.position.set(1.55, 3.95, 0);
    statue.add(rightStud);

    hub.add(statue);

    // Floating Giant 3D Tilted Roblox Logo Crown overhead
    const crownLogo = new THREE.Group();
    crownLogo.position.y = 8.8;

    const crownOuterGeo = new THREE.BoxGeometry(1.6, 1.6, 0.4);
    const crownOuterMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.6 });
    const crownOuter = new THREE.Mesh(crownOuterGeo, crownOuterMat);
    crownOuter.rotation.z = Math.PI / 6;
    crownLogo.add(crownOuter);

    const crownInnerGeo = new THREE.BoxGeometry(0.65, 0.65, 0.45);
    const crownInnerMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
    const crownInner = new THREE.Mesh(crownInnerGeo, crownInnerMat);
    crownInner.rotation.z = Math.PI / 6;
    crownLogo.add(crownInner);

    hub.add(crownLogo);
    hub.userData.crownLogo = crownLogo;

    this.scene.add(hub);
    this.hubs.push({
      id: 'roblox',
      name: 'Roblox Gateway',
      sub: 'Press E to Launch Roblox Directly',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // ⛏️ 2. EXACT REPLICA: AUTHENTIC 16x16 MINECRAFT GRASS BLOCK
  _createMinecraftGrassBlockHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Pedestal
    const baseGeo = new THREE.CylinderGeometry(4.4, 4.8, 0.5, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    hub.add(base);

    // Giant 16x16 Pixel Minecraft Block Group
    const blockGroup = new THREE.Group();
    blockGroup.position.y = 2.75;

    // Generate authentic Minecraft 16x16 pixel textures
    const grassTopTex = createMinecraftGrassTopTexture();
    const grassSideTex = createMinecraftGrassSideTexture();
    const dirtBottomTex = createMinecraftDirtBottomTexture();

    const grassTopMat = new THREE.MeshStandardMaterial({ map: grassTopTex, roughness: 0.85 });
    const grassSideMat = new THREE.MeshStandardMaterial({ map: grassSideTex, roughness: 0.85 });
    const dirtBottomMat = new THREE.MeshStandardMaterial({ map: dirtBottomTex, roughness: 0.85 });

    // 6-sided materials array: [Right, Left, Top, Bottom, Front, Back]
    const blockMaterials = [
      grassSideMat,   // Right Side
      grassSideMat,   // Left Side
      grassTopMat,    // Top Face (Emerald Pixel Grid)
      dirtBottomMat,  // Bottom Face (Dirt Grid)
      grassSideMat,   // Front Side (Jagged Overhang)
      grassSideMat    // Back Side (Jagged Overhang)
    ];

    const blockGeo = new THREE.BoxGeometry(4.6, 4.6, 4.6);
    const grassBlockMesh = new THREE.Mesh(blockGeo, blockMaterials);
    blockGroup.add(grassBlockMesh);

    // Giant Pixelated Diamond Pickaxe Embedded on Top
    const pickaxeGroup = new THREE.Group();
    pickaxeGroup.position.set(0, 2.3, 0);
    pickaxeGroup.rotation.z = -Math.PI / 4;
    pickaxeGroup.rotation.y = Math.PI / 4;

    const pickHandleGeo = new THREE.BoxGeometry(0.25, 3.2, 0.25);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x866043, roughness: 0.8 });
    const pickHandle = new THREE.Mesh(pickHandleGeo, woodMat);
    pickHandle.position.y = 1.0;
    pickaxeGroup.add(pickHandle);

    const diamondPickMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.8
    });
    const pickHeadGeo = new THREE.BoxGeometry(2.2, 0.4, 0.4);
    const pickHead = new THREE.Mesh(pickHeadGeo, diamondPickMat);
    pickHead.position.y = 2.4;
    pickaxeGroup.add(pickHead);

    blockGroup.add(pickaxeGroup);

    hub.add(blockGroup);
    hub.userData.blockGroup = blockGroup;

    this.scene.add(hub);
    this.hubs.push({
      id: 'minecraft',
      name: 'Minecraft Station',
      sub: 'Press E to Launch Minecraft Bedrock',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // ▶️ 3. EXACT REPLICA: GIANT GLOSSY YOUTUBE PLAY BUTTON
  _createYouTubePlayButtonHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Glowing Crimson Pedestal
    const baseGeo = new THREE.CylinderGeometry(4.0, 4.4, 0.5, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    hub.add(base);

    const redRingGeo = new THREE.TorusGeometry(4.1, 0.12, 8, 32);
    const redRingMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const redRing = new THREE.Mesh(redRingGeo, redRingMat);
    redRing.rotation.x = Math.PI / 2;
    redRing.position.y = 0.5;
    hub.add(redRing);

    // Floating YouTube Play Button
    const playButtonGroup = new THREE.Group();
    playButtonGroup.position.y = 3.6;

    // Metallic Red Chamfered Shield Body
    const playBodyGeo = new THREE.BoxGeometry(5.4, 3.6, 0.9);
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xaa0000,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.75
    });
    const playBody = new THREE.Mesh(playBodyGeo, redMat);
    playButtonGroup.add(playBody);

    // Smooth rounded side caps
    const capGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.9, 24);
    const leftCap = new THREE.Mesh(capGeo, redMat);
    leftCap.position.set(-2.0, 0, 0);
    playButtonGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, redMat);
    rightCap.position.set(2.0, 0, 0);
    playButtonGroup.add(rightCap);

    // Pure White 3D Play Triangle Icon
    const playShape = new THREE.Shape();
    playShape.moveTo(-0.75, -0.85);
    playShape.lineTo(0.95, 0);
    playShape.lineTo(-0.75, 0.85);
    playShape.lineTo(-0.75, -0.85);

    const playIconGeo = new THREE.ExtrudeGeometry(playShape, { depth: 0.3, bevelEnabled: false });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2 });
    const playIcon = new THREE.Mesh(playIconGeo, whiteMat);
    playIcon.position.set(0, 0, 0.4);
    playButtonGroup.add(playIcon);

    const backPlayIcon = new THREE.Mesh(playIconGeo, whiteMat);
    backPlayIcon.rotation.y = Math.PI;
    backPlayIcon.position.set(0, 0, -0.4);
    playButtonGroup.add(backPlayIcon);

    hub.add(playButtonGroup);
    hub.userData.playButtonGroup = playButtonGroup;

    this.scene.add(hub);
    this.hubs.push({
      id: 'youtube',
      name: 'YouTube Media Nexus',
      sub: 'Press E for YouTube Kids / Regular YouTube',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // 🏆 4. EXACT REPLICA: GIANT ESPORTS CHAMPIONSHIP GOLD TROPHY
  _createHallOfFameTrophyHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Tiered Podium Base
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });

    const centerPodiumGeo = new THREE.BoxGeometry(2.4, 1.2, 2.4);
    const centerPodium = new THREE.Mesh(centerPodiumGeo, podiumMat);
    centerPodium.position.set(0, 0.6, 0);
    hub.add(centerPodium);

    const leftPodiumGeo = new THREE.BoxGeometry(2.0, 0.8, 2.0);
    const leftPodium = new THREE.Mesh(leftPodiumGeo, podiumMat);
    leftPodium.position.set(-2.0, 0.4, 0);
    hub.add(leftPodium);

    const rightPodiumGeo = new THREE.BoxGeometry(2.0, 0.5, 2.0);
    const rightPodium = new THREE.Mesh(rightPodiumGeo, podiumMat);
    rightPodium.position.set(2.0, 0.25, 0);
    hub.add(rightPodium);

    // Sculpted Gold Championship Trophy
    const trophy = new THREE.Group();
    trophy.position.y = 1.2;

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.1
    });

    const trophyBaseGeo = new THREE.CylinderGeometry(0.9, 1.2, 0.6, 16);
    const trophyBase = new THREE.Mesh(trophyBaseGeo, goldMat);
    trophyBase.position.y = 0.3;
    trophy.add(trophyBase);

    const stemGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.0, 16);
    const stem = new THREE.Mesh(stemGeo, goldMat);
    stem.position.y = 1.1;
    trophy.add(stem);

    const cupGeo = new THREE.CylinderGeometry(1.6, 0.7, 2.2, 24, 1, true);
    const cup = new THREE.Mesh(cupGeo, goldMat);
    cup.position.y = 2.6;
    trophy.add(cup);

    const cupBottomGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 24);
    const cupBottom = new THREE.Mesh(cupBottomGeo, goldMat);
    cupBottom.position.y = 1.5;
    trophy.add(cupBottom);

    // Dual Winged Handles
    const handleGeo = new THREE.TorusGeometry(0.8, 0.12, 10, 24, Math.PI);
    const leftHandle = new THREE.Mesh(handleGeo, goldMat);
    leftHandle.rotation.z = -Math.PI / 2;
    leftHandle.position.set(-1.6, 2.6, 0);
    trophy.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMat);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(1.6, 2.6, 0);
    trophy.add(rightHandle);

    // Floating Golden Star
    const starGeo = new THREE.OctahedronGeometry(0.7, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.y = 4.3;
    trophy.add(star);

    hub.add(trophy);
    hub.userData.trophy = trophy;

    this.scene.add(hub);
    this.hubs.push({
      id: 'leaderboard',
      name: 'Gamers Hall of Fame',
      sub: 'Press E to View Weekly Leaderboard & Rankings',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // 🚀 5. GIANT NEON RETRO ARCADE CABINET (SPACE TYPING)
  _createSpaceTypingHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    const baseGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.4, 20);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.2;
    hub.add(base);

    const cabinetGroup = new THREE.Group();
    cabinetGroup.position.y = 0.4;

    const cabBodyGeo = new THREE.BoxGeometry(2.4, 4.4, 2.0);
    const cabBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.8 });
    const cabBody = new THREE.Mesh(cabBodyGeo, cabBodyMat);
    cabBody.position.y = 2.2;
    cabinetGroup.add(cabBody);

    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const bezelGeo = new THREE.BoxGeometry(2.46, 0.12, 2.06);
    const topBezel = new THREE.Mesh(bezelGeo, bezelMat);
    topBezel.position.y = 4.4;
    cabinetGroup.add(topBezel);

    const screenGeo = new THREE.PlaneGeometry(1.8, 1.4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.8, 1.02);
    cabinetGroup.add(screen);

    const deckGeo = new THREE.BoxGeometry(2.2, 0.4, 0.9);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 1.7, 1.25);
    cabinetGroup.add(deck);

    const stickGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
    const redStickMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const stick1 = new THREE.Mesh(stickGeo, redStickMat);
    stick1.position.set(-0.6, 2.0, 1.25);
    cabinetGroup.add(stick1);

    const stick2 = new THREE.Mesh(stickGeo, redStickMat);
    stick2.position.set(0.6, 2.0, 1.25);
    cabinetGroup.add(stick2);

    const marqueeGeo = new THREE.BoxGeometry(2.2, 0.6, 0.2);
    const marqueeMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const marquee = new THREE.Mesh(marqueeGeo, marqueeMat);
    marquee.position.set(0, 4.0, 1.02);
    cabinetGroup.add(marquee);

    hub.add(cabinetGroup);

    this.scene.add(hub);
    this.hubs.push({
      id: 'space-typing',
      name: 'Space Typing Arcade',
      sub: 'Press E to Play Space Typing & Earn Points',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // 🌐 6. DYSON WEB OBSERVATORY
  _createWebExplorerHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    const domeBaseGeo = new THREE.CylinderGeometry(3.8, 4.4, 1.4, 18);
    const domeBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const domeBase = new THREE.Mesh(domeBaseGeo, domeBaseMat);
    domeBase.position.y = 0.7;
    hub.add(domeBase);

    const globeGeo = new THREE.SphereGeometry(2.2, 14, 10);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.y = 4.0;
    hub.add(globe);
    hub.userData.globe = globe;

    const ringGeo = new THREE.TorusGeometry(3.2, 0.08, 6, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.y = 4.0;
    hub.add(ring);
    hub.userData.ring = ring;

    this.scene.add(hub);
    this.hubs.push({
      id: 'web-explorer',
      name: 'Web Explorer Observatory',
      sub: 'Press E for Safe Web & Google Earth',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // ✨ 7. WARDROBE STYLIST PAVILION
  _createWardrobeHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    const mirrorFrameGeo = new THREE.TorusGeometry(2.4, 0.25, 12, 28);
    const mirrorFrameMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.85, roughness: 0.15 });
    const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMat);
    mirrorFrame.position.y = 3.0;
    hub.add(mirrorFrame);

    const mirrorGeo = new THREE.CircleGeometry(2.2, 24);
    const mirrorMat = new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 3.0, 0.05);
    hub.add(mirror);

    this.scene.add(hub);
    this.hubs.push({
      id: 'wardrobe',
      name: 'Avatar Stylist Studio',
      sub: 'Press E to Customize Your 3D Avatar',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  // 🔐 8. KUYA RICKY & ADMIN TOWER
  _createAdminCommandStation(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    const towerGeo = new THREE.CylinderGeometry(0.8, 1.3, 8.5, 10);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.25 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 4.25;
    hub.add(tower);

    const starGeo = new THREE.OctahedronGeometry(1.3, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.y = 9.8;
    hub.add(star);
    hub.userData.star = star;

    this.scene.add(hub);
    this.hubs.push({
      id: 'admin',
      name: 'Kuya Ricky & Admin Command',
      sub: 'Press E for Admin Console & Playtime Bonus',
      position: new THREE.Vector3(x, y, z),
      radius: 4.5,
      group: hub
    });
  }

  update(delta, playerPos) {
    for (let i = 0; i < this.hubs.length; i++) {
      const h = this.hubs[i];
      const u = h.group.userData;

      if (u.crownLogo) {
        u.crownLogo.rotation.y += delta * 1.5;
      }

      if (u.blockGroup) {
        u.blockGroup.rotation.y += delta * 0.4;
      }

      if (u.playButtonGroup) {
        u.playButtonGroup.rotation.y += delta * 0.6;
        u.playButtonGroup.position.y = 3.6 + Math.sin(Date.now() * 0.0025) * 0.2;
      }

      if (u.trophy) {
        u.trophy.rotation.y += delta * 0.7;
      }

      if (u.globe) u.globe.rotation.y += delta * 0.9;
      if (u.ring) u.ring.rotation.z += delta * 0.6;
      if (u.star) u.star.rotation.y += delta * 1.6;
    }

    if (!playerPos) {
      this.activeHub = null;
      return null;
    }

    let nearest = null;
    let minDistance = Infinity;

    for (let i = 0; i < this.hubs.length; i++) {
      const h = this.hubs[i];
      const distSq = (playerPos.x - h.position.x) * (playerPos.x - h.position.x) + (playerPos.z - h.position.z) * (playerPos.z - h.position.z);
      if (distSq < h.radius * h.radius && distSq < minDistance) {
        nearest = h;
        minDistance = distSq;
      }
    }

    this.activeHub = nearest;
    return nearest;
  }
}
