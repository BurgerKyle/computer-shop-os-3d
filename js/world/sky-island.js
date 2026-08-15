// Frontier Cyber-Floating Sky Island with Levitating Mini-Islands & Sky Cascades (No Trees, High-Performance)
import * as THREE from 'three';

export class SkyIsland {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'SkyIsland';
    this.islandRadius = 38;

    this.waterfallMeshes = [];

    this._buildMainIsland();
    this._buildPathways();
    this._buildSkyIslandsAndCascades();
    this._buildEnergyConduits();

    this.scene.add(this.root);
  }

  _buildMainIsland() {
    // 1. Grassy Plateau Top Surface (Y = 0)
    const topGeo = new THREE.CylinderGeometry(this.islandRadius, this.islandRadius + 1.8, 2.8, 36);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.7,
      metalness: 0.1
    });

    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = -1.4;
    topMesh.receiveShadow = true;
    this.root.add(topMesh);

    // 2. Dark Slate & Titanium Island Underbelly
    const rockGeo = new THREE.ConeGeometry(this.islandRadius + 1.8, 36, 24);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.3,
      flatShading: true
    });

    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -20.5;
    this.root.add(rockMesh);

    // 3. Central Quantum Plaza (Brushed Titanium Paver)
    const plazaGeo = new THREE.CylinderGeometry(9.5, 9.5, 0.1, 32);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.6
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
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.4
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
    // 4 Floating Sky Islands in the upper atmosphere with waterfalls cascading down onto the main island!
    const skyIslandsData = [
      {
        skyX: 20,
        skyY: 22,
        skyZ: -16,
        radius: 6.5,
        landingX: 20,
        landingZ: -16,
        color: 0x38bdf8
      },
      {
        skyX: -22,
        skyY: 26,
        skyZ: -14,
        radius: 7.0,
        landingX: -22,
        landingZ: -14,
        color: 0x00f2fe
      },
      {
        skyX: -18,
        skyY: 20,
        skyZ: 22,
        radius: 6.0,
        landingX: -18,
        landingZ: 22,
        color: 0x60a5fa
      },
      {
        skyX: 22,
        skyY: 24,
        skyZ: 18,
        radius: 6.8,
        landingX: 22,
        landingZ: 18,
        color: 0x00f2fe
      }
    ];

    const grassMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, flatShading: true });
    const crystalWaterMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const poolWaterMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.85
    });
    const splashMistMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65
    });

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

      // 🌊 Cascading Waterfall Curtain Pouring Down from Sky Island to Main Island!
      const fallHeight = isl.skyY - 0.2;
      const fallWidth = 2.4;
      const fallGeo = new THREE.PlaneGeometry(fallWidth, fallHeight, 4, 12);
      const fallMesh = new THREE.Mesh(fallGeo, crystalWaterMat);

      // Position waterfall vertically between sky island edge and main island
      fallMesh.position.set(isl.skyX + isl.radius * 0.7, fallHeight / 2, isl.skyZ);
      fallMesh.rotation.y = idx % 2 === 0 ? Math.PI / 4 : -Math.PI / 4;
      this.root.add(fallMesh);
      this.waterfallMeshes.push(fallMesh);

      // Second angled water layer for 3D volume
      const fallMesh2 = new THREE.Mesh(fallGeo, crystalWaterMat);
      fallMesh2.position.set(isl.skyX + isl.radius * 0.7, fallHeight / 2, isl.skyZ);
      fallMesh2.rotation.y = (idx % 2 === 0 ? Math.PI / 4 : -Math.PI / 4) + Math.PI / 2;
      this.root.add(fallMesh2);

      // Splash Pool on the Main Island Ground
      const splashPoolGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.12, 18);
      const splashPool = new THREE.Mesh(splashPoolGeo, poolWaterMat);
      splashPool.position.set(isl.skyX + isl.radius * 0.7, 0.08, isl.skyZ);
      this.root.add(splashPool);

      // Splash Pool Border (River Stones)
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

  _buildEnergyConduits() {
    const obeliskGeo = new THREE.BoxGeometry(0.35, 2.4, 0.35);
    const diamondGeo = new THREE.OctahedronGeometry(0.4, 0);

    const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const purpleMat = new THREE.MeshBasicMaterial({ color: 0x9333ea });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.38;
      const distance = 14;

      const pylonGroup = new THREE.Group();
      pylonGroup.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );

      const pylonMat = i % 2 === 0 ? cyanMat : purpleMat;

      const obelisk = new THREE.Mesh(obeliskGeo, pylonMat);
      obelisk.position.y = 1.2;
      pylonGroup.add(obelisk);

      const diamond = new THREE.Mesh(diamondGeo, pylonMat);
      diamond.position.y = 2.8;
      pylonGroup.add(diamond);

      this.root.add(pylonGroup);
    }
  }
}
