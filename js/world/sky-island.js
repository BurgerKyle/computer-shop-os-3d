// Frontier Cyber-Floating Sky Island Architecture & Terrain (High-Performance 60/120 FPS Optimized)
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

  _buildFloatingMiniIslands() {
    const miniPositions = [
      { x: 50, y: 5, z: -18, scale: 0.55, color: 0x00f2fe },
      { x: -52, y: -2, z: 28, scale: 0.5, color: 0x9333ea },
      { x: 12, y: 9, z: 54, scale: 0.45, color: 0xf43f5e },
      { x: -38, y: 7, z: -48, scale: 0.6, color: 0x10b981 }
    ];

    const grassMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, flatShading: true });
    const topGeo = new THREE.CylinderGeometry(15, 16, 2.5, 16);
    const bottomGeo = new THREE.ConeGeometry(16, 20, 16);
    const crystalGeo = new THREE.OctahedronGeometry(3.2, 0);

    miniPositions.forEach(p => {
      const island = new THREE.Group();
      island.position.set(p.x, p.y, p.z);
      island.scale.setScalar(p.scale);

      const top = new THREE.Mesh(topGeo, grassMat);
      island.add(top);

      const bottom = new THREE.Mesh(bottomGeo, rockMat);
      bottom.rotation.x = Math.PI;
      bottom.position.y = -11;
      island.add(bottom);

      const crystalMat = new THREE.MeshBasicMaterial({ color: p.color });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 5.5;
      island.add(crystal);

      const bridgeGeo = new THREE.PlaneGeometry(2.0, 20);
      const bridgeMat = new THREE.MeshBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.35,
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

    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.42, 2.8, 6);
    const leafBottomGeo = new THREE.DodecahedronGeometry(2.0, 0);
    const leafTopGeo = new THREE.DodecahedronGeometry(1.4, 0);

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + 0.18;
      const distance = 16 + (i % 3) * 7.5;

      const treeGroup = new THREE.Group();
      treeGroup.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );

      const scale = 0.85 + Math.random() * 0.45;
      treeGroup.scale.setScalar(scale);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.4;
      treeGroup.add(trunk);

      const folMat = i % 3 === 0 ? cyberLeavesCyan : (i % 3 === 1 ? cyberLeavesPurple : emeraldLeaves);

      const leafBottom = new THREE.Mesh(leafBottomGeo, folMat);
      leafBottom.position.y = 3.2;
      treeGroup.add(leafBottom);

      const leafTop = new THREE.Mesh(leafTopGeo, folMat);
      leafTop.position.y = 4.5;
      treeGroup.add(leafTop);

      this.root.add(treeGroup);
    }
  }

  _buildWaterfalls() {
    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.8
    });

    const fallGeo = new THREE.PlaneGeometry(4.0, 32);
    const fallMesh = new THREE.Mesh(fallGeo, waterMat);
    fallMesh.position.set(-this.islandRadius + 0.8, -16, 9);
    fallMesh.rotation.y = Math.PI / 2;
    this.root.add(fallMesh);
  }

  _buildEnergyConduits() {
    const obeliskGeo = new THREE.BoxGeometry(0.35, 2.4, 0.35);
    const diamondGeo = new THREE.OctahedronGeometry(0.4, 0);

    const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const purpleMat = new THREE.MeshBasicMaterial({ color: 0x9333ea });

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + 0.22;
      const distance = 14 + (i % 2) * 10;

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
