// Frontier AI Lab 3D Interactive Hub Megastructures
import * as THREE from 'three';

export class HubsManager {
  constructor(scene) {
    this.scene = scene;
    this.hubs = [];
    this.activeHub = null;

    this._buildAllHubs();
  }

  _buildAllHubs() {
    // 1. Roblox Quantum Gate (East, 0°)
    this._createRobloxHub(26, 0, 0);

    // 2. Minecraft Voxel Citadel (50°)
    const mcAngle = (50 * Math.PI) / 180;
    this._createMinecraftHub(Math.sin(mcAngle) * 26, 0, Math.cos(mcAngle) * 26);

    // 3. Space Typing Cyber Arcade (110°)
    const stAngle = (110 * Math.PI) / 180;
    this._createSpaceTypingHub(Math.sin(stAngle) * 26, 0, Math.cos(stAngle) * 26);

    // 4. YouTube Media Arch (170°)
    const ytAngle = (170 * Math.PI) / 180;
    this._createYouTubeHub(Math.sin(ytAngle) * 26, 0, Math.cos(ytAngle) * 26);

    // 5. Web Dyson Observatory (230°)
    const webAngle = (230 * Math.PI) / 180;
    this._createWebExplorerHub(Math.sin(webAngle) * 26, 0, Math.cos(webAngle) * 26);

    // 6. Apex Leaderboard Spire (280°)
    const lbAngle = (280 * Math.PI) / 180;
    this._createLeaderboardHub(Math.sin(lbAngle) * 26, 0, Math.cos(lbAngle) * 26);

    // 7. Wardrobe Stylist Pavilion (330°)
    const wardAngle = (330 * Math.PI) / 180;
    this._createWardrobeHub(Math.sin(wardAngle) * 26, 0, Math.cos(wardAngle) * 26);

    // 8. Kuya Ricky Operations Command (Center, Z = -4)
    this._createAdminCommandStation(0, 0, -4.5);
  }

  _createRobloxHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Quantum Ring Accelerator Frame
    const ringGeo = new THREE.TorusGeometry(3.4, 0.3, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 3.6;
    hub.add(ring);
    hub.userData.outerRing = ring;

    // Inner Counter-Rotating Ring
    const innerRingGeo = new THREE.TorusGeometry(2.8, 0.15, 16, 36);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xef4444,
      emissiveIntensity: 0.9
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerMat);
    innerRing.position.y = 3.6;
    hub.add(innerRing);
    hub.userData.innerRing = innerRing;

    // Event Horizon Energy Core
    const portalGeo = new THREE.CircleGeometry(2.6, 32);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const portal = new THREE.Mesh(portalGeo, portalMat);
    portal.position.y = 3.6;
    hub.add(portal);

    // Floating 3D Diamond Hologram
    const logoGeo = new THREE.OctahedronGeometry(1.0, 0);
    const logoMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const logo = new THREE.Mesh(logoGeo, logoMat);
    logo.position.y = 6.2;
    hub.add(logo);
    hub.userData.logo = logo;

    // Dark Titanium Pedestal
    const baseGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.2;
    hub.add(base);

    const beaconLight = new THREE.PointLight(0xef4444, 2.5, 14);
    beaconLight.position.y = 3.6;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'roblox',
      name: 'Roblox Hyper-Gateway',
      sub: 'Launch Roblox games & track session stats',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createMinecraftHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Crystalline Obsidian Citadel Frame
    const frameGeo = new THREE.BoxGeometry(4.4, 6.0, 0.9);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8, metalness: 0.5 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 3.0;
    hub.add(frame);

    // Shimmering Nether Rift
    const riftGeo = new THREE.PlaneGeometry(3.0, 4.6);
    const riftMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x7e22ce,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const rift = new THREE.Mesh(riftGeo, riftMat);
    rift.position.set(0, 3.0, 0.47);
    hub.add(rift);

    // Floating Emerald & Diamond Monoliths
    const emeraldGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    const emerald = new THREE.Mesh(emeraldGeo, emeraldMat);
    emerald.position.set(-2.8, 0.7, 0);
    hub.add(emerald);

    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    const diamond = new THREE.Mesh(emeraldGeo, diamondMat);
    diamond.position.set(2.8, 0.7, 0);
    hub.add(diamond);

    const beaconLight = new THREE.PointLight(0x9333ea, 2.5, 14);
    beaconLight.position.y = 3.2;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'minecraft',
      name: 'Minecraft Voxel Citadel',
      sub: 'Bedrock Launcher & Cotmon Multiplayer',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createSpaceTypingHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Neon Cyber Arcade Pavilion
    const roofGeo = new THREE.ConeGeometry(4.0, 2.4, 6);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.2, metalness: 0.8 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 4.4;
    hub.add(roof);

    // Glowing Neon Cyber Columns
    const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 8);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.9
    });

    for (let i = 0; i < 4; i++) {
      const col = new THREE.Mesh(colGeo, colMat);
      const angle = (i / 4) * Math.PI * 2;
      col.position.set(Math.cos(angle) * 2.8, 1.9, Math.sin(angle) * 2.8);
      hub.add(col);
    }

    // Arcade Console & Holographic Screen
    const arcadeGeo = new THREE.BoxGeometry(1.4, 2.4, 1.4);
    const arcadeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const arcade = new THREE.Mesh(arcadeGeo, arcadeMat);
    arcade.position.y = 1.2;
    hub.add(arcade);

    const screenGeo = new THREE.PlaneGeometry(0.9, 0.7);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.0
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.5, 0.72);
    hub.add(screen);

    // Floating Levitating Space Rocket
    const rocketGeo = new THREE.ConeGeometry(0.6, 1.6, 8);
    const rocketMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6
    });
    const rocket = new THREE.Mesh(rocketGeo, rocketMat);
    rocket.position.y = 6.2;
    hub.add(rocket);
    hub.userData.rocket = rocket;

    const beaconLight = new THREE.PointLight(0x00f2fe, 2.5, 14);
    beaconLight.position.y = 3.2;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'space-typing',
      name: 'Quantum Typing Arcade',
      sub: 'Play Space Typing & Earn Leaderboard Points',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createYouTubeHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Monolithic Curved Cinema Screen Frame
    const screenFrameGeo = new THREE.BoxGeometry(5.6, 3.4, 0.4);
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.3, metalness: 0.8 });
    const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
    screenFrame.position.y = 3.0;
    hub.add(screenFrame);

    // Glowing Crimson Screen
    const screenGeo = new THREE.PlaneGeometry(5.2, 3.0);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 3.0, 0.22);
    hub.add(screen);

    // 3D Play Holographic Glyph
    const playShape = new THREE.Shape();
    playShape.moveTo(-0.45, -0.45);
    playShape.lineTo(0.55, 0);
    playShape.lineTo(-0.45, 0.45);
    playShape.lineTo(-0.45, -0.45);

    const playGeo = new THREE.ExtrudeGeometry(playShape, { depth: 0.12, bevelEnabled: false });
    const playMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const playIcon = new THREE.Mesh(playGeo, playMat);
    playIcon.position.set(0, 3.0, 0.25);
    hub.add(playIcon);

    const beaconLight = new THREE.PointLight(0xff0000, 2.5, 14);
    beaconLight.position.y = 3.2;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'youtube',
      name: 'YouTube Media Nexus',
      sub: 'YouTube Kids / Regular YouTube (Age-Gated)',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createWebExplorerHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Dyson Sphere Cyber Observatory Base
    const domeBaseGeo = new THREE.CylinderGeometry(3.8, 4.4, 1.4, 24);
    const domeBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const domeBase = new THREE.Mesh(domeBaseGeo, domeBaseMat);
    domeBase.position.y = 0.7;
    hub.add(domeBase);

    // Rotating Holographic Wireframe Globe
    const globeGeo = new THREE.SphereGeometry(2.2, 20, 16);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      wireframe: true
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.y = 4.0;
    hub.add(globe);
    hub.userData.globe = globe;

    // Orbiting Satellite Rings
    const ringGeo = new THREE.TorusGeometry(3.2, 0.09, 8, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.95
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.y = 4.0;
    hub.add(ring);
    hub.userData.ring = ring;

    const beaconLight = new THREE.PointLight(0x00f2fe, 2.5, 14);
    beaconLight.position.y = 4.0;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'web-explorer',
      name: 'Dyson Web Observatory',
      sub: 'Safe Web, Kiddle, Nat Geo, Earth',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createLeaderboardHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Golden Champion Apex Podium
    const podiumGeo = new THREE.CylinderGeometry(3.2, 3.8, 1.4, 12);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = 0.7;
    hub.add(podium);

    // Floating Golden Crystalline Spire / Trophy
    const trophyGroup = new THREE.Group();
    trophyGroup.position.y = 3.8;

    const spireGeo = new THREE.OctahedronGeometry(1.6, 0);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xd97706,
      emissiveIntensity: 0.7,
      metalness: 0.95,
      roughness: 0.05
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.scale.set(0.8, 1.8, 0.8);
    trophyGroup.add(spire);

    hub.add(trophyGroup);
    hub.userData.trophy = trophyGroup;

    const beaconLight = new THREE.PointLight(0xf59e0b, 2.8, 14);
    beaconLight.position.y = 3.8;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'leaderboard',
      name: 'Apex Hall of Fame',
      sub: 'Top Gamers of the Week',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createWardrobeHub(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Holographic Stylist Mirror Arch
    const mirrorFrameGeo = new THREE.TorusGeometry(2.4, 0.28, 16, 36);
    const mirrorFrameMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xbe185d,
      emissiveIntensity: 0.7,
      metalness: 0.85,
      roughness: 0.15
    });
    const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, mirrorFrameMat);
    mirrorFrame.position.y = 3.0;
    hub.add(mirrorFrame);

    // Shimmering Holographic Surface
    const mirrorGeo = new THREE.CircleGeometry(2.2, 32);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 3.0, 0.05);
    hub.add(mirror);

    const beaconLight = new THREE.PointLight(0xf43f5e, 2.5, 14);
    beaconLight.position.y = 3.2;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'wardrobe',
      name: 'Avatar Stylist Studio',
      sub: 'Customize your 3D outfit, wings & colors',
      position: new THREE.Vector3(x, y, z),
      radius: 5.0,
      group: hub
    });
  }

  _createAdminCommandStation(x, y, z) {
    const hub = new THREE.Group();
    hub.position.set(x, y, z);

    // Monolithic Golden Beacon Spire
    const towerGeo = new THREE.CylinderGeometry(0.8, 1.3, 8.5, 12);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.25
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 4.25;
    hub.add(tower);

    // Floating Rotating Golden Core Star
    const starGeo = new THREE.OctahedronGeometry(1.3, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.0,
      metalness: 0.7,
      roughness: 0.1
    });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.y = 9.8;
    hub.add(star);
    hub.userData.star = star;

    const beaconLight = new THREE.PointLight(0xf59e0b, 3.2, 18);
    beaconLight.position.y = 9.8;
    hub.add(beaconLight);

    this.scene.add(hub);
    this.hubs.push({
      id: 'admin',
      name: 'Kuya Ricky & Admin Command',
      sub: 'Admin console, live chat & playtime bonus',
      position: new THREE.Vector3(x, y, z),
      radius: 4.5,
      group: hub
    });
  }

  update(delta, playerPos) {
    // Animate hub ornaments
    for (let i = 0; i < this.hubs.length; i++) {
      const h = this.hubs[i];
      const u = h.group.userData;
      if (u.outerRing) u.outerRing.rotation.z += delta * 0.8;
      if (u.innerRing) u.innerRing.rotation.z -= delta * 1.2;
      if (u.logo) u.logo.rotation.y += delta * 1.5;
      if (u.rocket) {
        u.rocket.rotation.y += delta * 1.6;
        u.rocket.position.y = 6.2 + Math.sin(Date.now() * 0.003) * 0.25;
      }
      if (u.globe) u.globe.rotation.y += delta * 0.9;
      if (u.ring) u.ring.rotation.z += delta * 0.6;
      if (u.trophy) {
        u.trophy.rotation.y += delta * 1.1;
        u.trophy.position.y = 3.8 + Math.sin(Date.now() * 0.003) * 0.2;
      }
      if (u.star) {
        u.star.rotation.y += delta * 1.6;
        u.star.rotation.z += delta * 0.9;
      }
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
