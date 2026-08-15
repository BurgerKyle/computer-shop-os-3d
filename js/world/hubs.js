// Frontier 3D Hub Landmark Models: Giant Roblox Statue, Minecraft Grass Block, YouTube Play Button, Hall of Fame Trophy
import * as THREE from 'three';

export class HubsManager {
  constructor(scene) {
    this.scene = scene;
    this.hubs = [];
    this.activeHub = null;

    this._buildAllHubs();
  }

  _buildAllHubs() {
    // 1. Roblox Hub - Giant Robloxian Character Statue (East, 0°)
    this._createRobloxStatueHub(26, 0, 0);

    // 2. Minecraft Hub - Giant Minecraft Grass Block (50°)
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

  // 🎮 1. GIANT ROBLOXIAN CHARACTER STATUE
  _createRobloxStatueHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Stone / Titanium Pedestal
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

    // Roblox Character Statue Group
    const statue = new THREE.Group();
    statue.position.y = 0.8;

    // Materials (Classic Roblox Palette)
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.1 }); // Classic yellow skin
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.1 });   // Classic blue torso
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3, metalness: 0.1 });  // Classic green legs

    // Legs (Left & Right)
    const legGeo = new THREE.BoxGeometry(1.0, 2.0, 1.0);
    const leftLeg = new THREE.Mesh(legGeo, greenMat);
    leftLeg.position.set(-0.55, 1.0, 0);
    statue.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, greenMat);
    rightLeg.position.set(0.55, 1.0, 0);
    statue.add(rightLeg);

    // Torso (Blocky Rectangular)
    const torsoGeo = new THREE.BoxGeometry(2.1, 2.0, 1.05);
    const torso = new THREE.Mesh(torsoGeo, blueMat);
    torso.position.set(0, 3.0, 0);
    statue.add(torso);

    // Iconic Tilted Roblox "R" Square Logo on Chest
    const logoSquareGeo = new THREE.BoxGeometry(0.75, 0.75, 0.08);
    const logoMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const logoSquare = new THREE.Mesh(logoSquareGeo, logoMat);
    logoSquare.rotation.z = Math.PI / 6; // 30° tilted classic Roblox square
    logoSquare.position.set(0, 3.1, 0.56);
    statue.add(logoSquare);

    const logoHoleGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const logoHole = new THREE.Mesh(logoHoleGeo, holeMat);
    logoHole.rotation.z = Math.PI / 6;
    logoHole.position.set(0, 3.1, 0.58);
    statue.add(logoHole);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.9, 2.0, 0.9);
    // Left Arm (Heroic Raised Pose)
    const leftArm = new THREE.Mesh(armGeo, yellowMat);
    leftArm.position.set(-1.55, 3.2, 0);
    leftArm.rotation.z = 0.35;
    statue.add(leftArm);

    // Right Arm (Holding Blocky Sword)
    const rightArm = new THREE.Mesh(armGeo, yellowMat);
    rightArm.position.set(1.55, 3.0, 0);
    statue.add(rightArm);

    // Blocky Roblox Sword
    const swordBladeGeo = new THREE.BoxGeometry(0.2, 2.4, 0.4);
    const swordMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const sword = new THREE.Mesh(swordBladeGeo, swordMat);
    sword.position.set(1.8, 3.6, 0.3);
    sword.rotation.x = -0.4;
    statue.add(sword);

    // Head
    const headGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const head = new THREE.Mesh(headGeo, yellowMat);
    head.position.set(0, 4.6, 0);
    statue.add(head);

    // Iconic Head Stud on Top
    const studGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12);
    const stud = new THREE.Mesh(studGeo, yellowMat);
    stud.position.set(0, 5.3, 0);
    statue.add(stud);

    // Classic Smile Face Decal geometry
    const eyeGeo = new THREE.BoxGeometry(0.16, 0.22, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 4.65, 0.62);
    statue.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.3, 4.65, 0.62);
    statue.add(rightEye);

    const smileGeo = new THREE.BoxGeometry(0.55, 0.1, 0.05);
    const smile = new THREE.Mesh(smileGeo, eyeMat);
    smile.position.set(0, 4.35, 0.62);
    statue.add(smile);

    hub.add(statue);

    // Floating Giant 3D Tilted Roblox Logo overhead
    const crownLogo = new THREE.Group();
    crownLogo.position.y = 6.8;

    const crownOuterGeo = new THREE.BoxGeometry(1.4, 1.4, 0.35);
    const crownOuterMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.6 });
    const crownOuter = new THREE.Mesh(crownOuterGeo, crownOuterMat);
    crownOuter.rotation.z = Math.PI / 6;
    crownLogo.add(crownOuter);

    const crownInnerGeo = new THREE.BoxGeometry(0.55, 0.55, 0.38);
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

  // ⛏️ 2. GIANT AUTHENTIC MINECRAFT GRASS BLOCK
  _createMinecraftGrassBlockHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Pedestal
    const baseGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.5, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    hub.add(base);

    // Giant Minecraft Grass Block (4.2 x 4.2 x 4.2 Cube)
    const blockGroup = new THREE.Group();
    blockGroup.position.y = 2.4;

    // 1. Dirt Base Cube
    const dirtGeo = new THREE.BoxGeometry(4.0, 4.0, 4.0);
    const dirtMat = new THREE.MeshStandardMaterial({
      color: 0x5c3d2e, // Minecraft Dirt Brown
      roughness: 0.9,
      metalness: 0.0
    });
    const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
    blockGroup.add(dirtMesh);

    // 2. Vibrant Emerald Grass Top
    const grassTopGeo = new THREE.BoxGeometry(4.02, 0.6, 4.02);
    const grassTopMat = new THREE.MeshStandardMaterial({
      color: 0x48b532, // Lush Minecraft Grass Green
      roughness: 0.8,
      metalness: 0.0
    });
    const grassTop = new THREE.Mesh(grassTopGeo, grassTopMat);
    grassTop.position.y = 1.72;
    blockGroup.add(grassTop);

    // 3. Stepped Grass Overhang Drops on all 4 sides (Iconic Minecraft overhang)
    const overhangMat = new THREE.MeshStandardMaterial({ color: 0x3ea129, roughness: 0.8 });
    const dropGeos = [
      { x: 0, y: 1.1, z: 2.03, w: 1.2, h: 0.8, d: 0.08 },
      { x: -1.2, y: 1.2, z: 2.03, w: 0.8, h: 0.5, d: 0.08 },
      { x: 1.2, y: 1.25, z: 2.03, w: 0.9, h: 0.6, d: 0.08 },
      { x: 0, y: 1.1, z: -2.03, w: 1.2, h: 0.8, d: 0.08 },
      { x: 2.03, y: 1.1, z: 0, w: 0.08, h: 0.8, d: 1.2 },
      { x: -2.03, y: 1.1, z: 0, w: 0.08, h: 0.8, d: 1.2 }
    ];

    dropGeos.forEach(d => {
      const dropMesh = new THREE.Mesh(new THREE.BoxGeometry(d.w, d.h, d.d), overhangMat);
      dropMesh.position.set(d.x, d.y, d.z);
      blockGroup.add(dropMesh);
    });

    // 4. Giant Pixelated Diamond Pickaxe Embedded on Top
    const pickaxeHandleGeo = new THREE.BoxGeometry(0.2, 2.6, 0.2);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
    const pickaxeHandle = new THREE.Mesh(pickaxeHandleGeo, woodMat);
    pickaxeHandle.position.set(0, 2.4, 0);
    pickaxeHandle.rotation.z = -Math.PI / 4;
    pickaxeHandle.rotation.y = Math.PI / 4;
    blockGroup.add(pickaxeHandle);

    const pickHeadGeo = new THREE.BoxGeometry(1.6, 0.35, 0.35);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8
    });
    const pickHead = new THREE.Mesh(pickHeadGeo, diamondMat);
    pickHead.position.set(0.9, 3.3, 0.9);
    pickHead.rotation.z = -Math.PI / 4;
    blockGroup.add(pickHead);

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

  // ▶️ 3. GIANT YOUTUBE PLAY BUTTON
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

    // Floating Giant YouTube Play Button Group
    const playButtonGroup = new THREE.Group();
    playButtonGroup.position.y = 3.5;

    // Rounded Red Metallic Play Button Body
    const playBodyGeo = new THREE.BoxGeometry(5.2, 3.4, 0.8);
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0x990000,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.7
    });
    const playBody = new THREE.Mesh(playBodyGeo, redMat);
    playButtonGroup.add(playBody);

    // Side curved edge caps
    const capGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.8, 20);
    const leftCap = new THREE.Mesh(capGeo, redMat);
    leftCap.position.set(-2.0, 0, 0);
    playButtonGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, redMat);
    rightCap.position.set(2.0, 0, 0);
    playButtonGroup.add(rightCap);

    // Pure White 3D Play Triangle Icon
    const playShape = new THREE.Shape();
    playShape.moveTo(-0.7, -0.75);
    playShape.lineTo(0.85, 0);
    playShape.lineTo(-0.7, 0.75);
    playShape.lineTo(-0.7, -0.75);

    const playIconGeo = new THREE.ExtrudeGeometry(playShape, { depth: 0.25, bevelEnabled: false });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2 });
    const playIcon = new THREE.Mesh(playIconGeo, whiteMat);
    playIcon.position.set(0, 0, 0.35);
    playButtonGroup.add(playIcon);

    // Back side play icon as well
    const backPlayIcon = new THREE.Mesh(playIconGeo, whiteMat);
    backPlayIcon.rotation.y = Math.PI;
    backPlayIcon.position.set(0, 0, -0.35);
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

  // 🏆 4. GIANT GOLD CHAMPIONSHIP TROPHY (HALL OF FAME)
  _createHallOfFameTrophyHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // 1st, 2nd, 3rd Tier Podium Base
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const goldPlaqueMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

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

    // Giant Sculpted Gold Championship Trophy
    const trophy = new THREE.Group();
    trophy.position.y = 1.2;

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.1
    });

    // Trophy Base
    const trophyBaseGeo = new THREE.CylinderGeometry(0.9, 1.2, 0.6, 16);
    const trophyBase = new THREE.Mesh(trophyBaseGeo, goldMat);
    trophyBase.position.y = 0.3;
    trophy.add(trophyBase);

    // Trophy Stem
    const stemGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.0, 16);
    const stem = new THREE.Mesh(stemGeo, goldMat);
    stem.position.y = 1.1;
    trophy.add(stem);

    // Trophy Main Cup
    const cupGeo = new THREE.CylinderGeometry(1.6, 0.7, 2.2, 24, 1, true);
    const cup = new THREE.Mesh(cupGeo, goldMat);
    cup.position.y = 2.6;
    trophy.add(cup);

    const cupBottomGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 24);
    const cupBottom = new THREE.Mesh(cupBottomGeo, goldMat);
    cupBottom.position.y = 1.5;
    trophy.add(cupBottom);

    // Dual Curved Trophy Handles (Left & Right)
    const handleGeo = new THREE.TorusGeometry(0.8, 0.12, 10, 24, Math.PI);
    const leftHandle = new THREE.Mesh(handleGeo, goldMat);
    leftHandle.rotation.z = -Math.PI / 2;
    leftHandle.position.set(-1.6, 2.6, 0);
    trophy.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMat);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(1.6, 2.6, 0);
    trophy.add(rightHandle);

    // Floating Golden Star atop Trophy
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

    // Pedestal
    const baseGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.4, 20);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.2;
    hub.add(base);

    // Giant Arcade Cabinet Body
    const cabinetGroup = new THREE.Group();
    cabinetGroup.position.y = 0.4;

    const cabBodyGeo = new THREE.BoxGeometry(2.4, 4.4, 2.0);
    const cabBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.8 });
    const cabBody = new THREE.Mesh(cabBodyGeo, cabBodyMat);
    cabBody.position.y = 2.2;
    cabinetGroup.add(cabBody);

    // Glowing Neon Cyan Edge Bezels
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const bezelGeo = new THREE.BoxGeometry(2.46, 0.12, 2.06);
    const topBezel = new THREE.Mesh(bezelGeo, bezelMat);
    topBezel.position.y = 4.4;
    cabinetGroup.add(topBezel);

    // Arcade CRT Screen
    const screenGeo = new THREE.PlaneGeometry(1.8, 1.4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.8, 1.02);
    cabinetGroup.add(screen);

    // Arcade Control Deck & Joysticks
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

    // Marquee Header
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

    // Rotating Holographic Wireframe Globe
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

      // Animate Roblox Overhead Logo
      if (u.crownLogo) {
        u.crownLogo.rotation.y += delta * 1.5;
        u.crownLogo.position.y = 6.8 + Math.sin(Date.now() * 0.003) * 0.2;
      }

      // Animate Minecraft Grass Block Gentle Float
      if (u.blockGroup) {
        u.blockGroup.rotation.y += delta * 0.5;
      }

      // Animate YouTube Play Button Levitation
      if (u.playButtonGroup) {
        u.playButtonGroup.rotation.y += delta * 0.7;
        u.playButtonGroup.position.y = 3.5 + Math.sin(Date.now() * 0.0025) * 0.25;
      }

      // Animate Trophy Glow Star
      if (u.trophy) {
        u.trophy.rotation.y += delta * 0.8;
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
