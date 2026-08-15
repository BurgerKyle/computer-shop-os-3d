// Frontier Cyber-Floating Sky Island Architecture & Terrain
import * as THREE from 'three';

export class SkyIsland {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'SkyIsland';
    this.islandRadius = 38;

    this._buildMainIsland();
    this._buildPathways();
    this._buildFloatingMiniIslands();
    this._buildVegetation();
    this._buildWaterfalls();
    this._buildEnergyConduits();

    this.scene.add(this.root);
  }

  _buildMainIsland() {
    // 1. Grassy Plateau Top Surface (Y = 0)
    const topGeo = new THREE.CylinderGeometry(this.islandRadius, this.islandRadius + 1.8, 2.8, 48);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Lush emerald grass
      roughness: 0.7,
      metalness: 0.1
    });

    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = -1.4;
    topMesh.receiveShadow = true;
    this.root.add(topMesh);

    // 2. Dark Slate & Titanium Island Underbelly
    const rockGeo = new THREE.ConeGeometry(this.islandRadius + 1.8, 36, 32);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Deep slate titanium
      roughness: 0.85,
      metalness: 0.3,
      flatShading: true
    });

    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -20.5;
    this.root.add(rockMesh);

    // 3. Central Quantum Plaza (Brushed Titanium Paver)
    const plazaGeo = new THREE.CylinderGeometry(9.5, 9.5, 0.1, 48);
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
    const innerRingGeo = new THREE.TorusGeometry(8.5, 0.14, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.9
    });
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.1;
    this.root.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(9.2, 0.08, 16, 64);
    const purpleRingMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x9333ea,
      emissiveIntensity: 0.8
    });
    const outerRing = new THREE.Mesh(outerRingGeo, purpleRingMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.1;
    this.root.add(outerRing);
  }

  _buildPathways() {
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark cobblestone with subtle metallic sheen
      roughness: 0.5,
      metalness: 0.4
    });

    const neonStripeMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.8
    });

    const hubAngles = [
      0,                     // Roblox Hub (East)
      (50 * Math.PI) / 180,  // Minecraft Hub
      (110 * Math.PI) / 180, // Space Typing Arcade
      (170 * Math.PI) / 180, // YouTube Hub
      (230 * Math.PI) / 180, // Web Explorer
      (280 * Math.PI) / 180, // Leaderboard Shrine
      (330 * Math.PI) / 180  // Wardrobe Stylist
    ];

    hubAngles.forEach(angle => {
      const pathLength = 17.5;
      const pathGeo = new THREE.BoxGeometry(3.6, 0.08, pathLength);
      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.receiveShadow = true;

      const midDist = 9.5 + pathLength / 2;
      pathMesh.position.set(
        Math.sin(angle) * midDist,
        0.04,
        Math.cos(angle) * midDist
      );
      pathMesh.rotation.y = angle;
      this.root.add(pathMesh);

      // Embedded Neon Energy Centerlines
      const stripeGeo = new THREE.BoxGeometry(0.12, 0.09, pathLength);
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

  _buildFloatingMiniIslands() {
    const miniPositions = [
      { x: 50, y: 5, z: -18, scale: 0.55, color: 0x00f2fe },
      { x: -52, y: -2, z: 28, scale: 0.5, color: 0x9333ea },
      { x: 12, y: 9, z: 54, scale: 0.45, color: 0xf43f5e },
      { x: -38, y: 7, z: -48, scale: 0.6, color: 0x10b981 }
    ];

    const grassMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, flatShading: true });

    miniPositions.forEach(p => {
      const island = new THREE.Group();
      island.position.set(p.x, p.y, p.z);
      island.scale.setScalar(p.scale);

      const topGeo = new THREE.CylinderGeometry(15, 16, 2.5, 18);
      const top = new THREE.Mesh(topGeo, grassMat);
      island.add(top);

      const bottomGeo = new THREE.ConeGeometry(16, 20, 18);
      const bottom = new THREE.Mesh(bottomGeo, rockMat);
      bottom.rotation.x = Math.PI;
      bottom.position.y = -11;
      island.add(bottom);

      // Floating Monolith Crystal
      const crystalGeo = new THREE.OctahedronGeometry(3.2, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.85,
        metalness: 0.3,
        roughness: 0.1
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 5.5;
      island.add(crystal);

      // Light bridge extending to main island
      const bridgeGeo = new THREE.PlaneGeometry(2.0, 20);
      const bridgeMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridge.rotation.x = Math.PI / 2;
      bridge.position.set(-p.x * 0.25, -p.y * 0.25, -p.z * 0.25);
      bridge.lookAt(0, 0, 0);
      island.add(bridge);

      this.root.add(island);
    });
  }

  _buildVegetation() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const cyberLeavesCyan = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x0284c7, emissiveIntensity: 0.4, roughness: 0.6, flatShading: true });
    const cyberLeavesPurple = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x9333ea, emissiveIntensity: 0.4, roughness: 0.6, flatShading: true });
    const emeraldLeaves = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7, flatShading: true });

    // Bioluminescent Cyber Bonsai Trees
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2 + 0.18;
      const distance = 16 + (i % 3) * 7.5;

      const treeGroup = new THREE.Group();
      treeGroup.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );

      const scale = 0.85 + Math.random() * 0.45;
      treeGroup.scale.setScalar(scale);

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.28, 0.42, 2.8, 8);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.4;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Foliage
      const folMat = i % 3 === 0 ? cyberLeavesCyan : (i % 3 === 1 ? cyberLeavesPurple : emeraldLeaves);

      const leafBottomGeo = new THREE.DodecahedronGeometry(2.0, 1);
      const leafBottom = new THREE.Mesh(leafBottomGeo, folMat);
      leafBottom.position.y = 3.2;
      leafBottom.castShadow = true;
      treeGroup.add(leafBottom);

      const leafTopGeo = new THREE.DodecahedronGeometry(1.4, 1);
      const leafTop = new THREE.Mesh(leafTopGeo, folMat);
      leafTop.position.y = 4.5;
      leafTop.castShadow = true;
      treeGroup.add(leafTop);

      this.root.add(treeGroup);
    }
  }

  _buildWaterfalls() {
    // Liquid Plasma Waterfall cascading into the void
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1
    });

    const fallGeo = new THREE.PlaneGeometry(4.0, 32, 8, 16);
    const fallMesh = new THREE.Mesh(fallGeo, waterMat);
    fallMesh.position.set(-this.islandRadius + 0.8, -16, 9);
    fallMesh.rotation.y = Math.PI / 2;
    this.root.add(fallMesh);
  }

  _buildEnergyConduits() {
    // Floating Power Pylons & Glow Beacons
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + 0.22;
      const distance = 12 + (i % 2) * 12;

      const pylonGroup = new THREE.Group();
      pylonGroup.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );

      const pylonColor = i % 2 === 0 ? 0x00f2fe : 0x9333ea;
      const pylonMat = new THREE.MeshStandardMaterial({
        color: pylonColor,
        emissive: pylonColor,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.5
      });

      // Monolith Obelisk
      const obeliskGeo = new THREE.BoxGeometry(0.35, 2.4, 0.35);
      const obelisk = new THREE.Mesh(obeliskGeo, pylonMat);
      obelisk.position.y = 1.2;
      pylonGroup.add(obelisk);

      // Floating Diamond Top
      const diamondGeo = new THREE.OctahedronGeometry(0.4, 0);
      const diamond = new THREE.Mesh(diamondGeo, pylonMat);
      diamond.position.y = 2.8;
      pylonGroup.add(diamond);

      const light = new THREE.PointLight(pylonColor, 1.4, 8);
      light.position.y = 2.8;
      pylonGroup.add(light);

      this.root.add(pylonGroup);
    }
  }
}
