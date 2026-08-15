// Procedural 3D Modular Avatar Builder for Three.js
import * as THREE from 'three';

export const DEFAULT_AVATAR = {
  skinColor: '#ffd1a4',
  hairStyle: 'spiky',
  hairColor: '#3b82f6',
  faceType: 'happy',
  outfitType: 'hoodie',
  primaryColor: '#06b6d4',
  secondaryColor: '#1e293b',
  backGear: 'wings',
  accessoryColor: '#ec4899'
};

export class AvatarBuilder {
  static create(config = {}) {
    const cfg = { ...DEFAULT_AVATAR, ...config };
    const root = new THREE.Group();
    root.name = 'Avatar';

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: cfg.skinColor,
      roughness: 0.6,
      metalness: 0.1
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: cfg.hairColor,
      roughness: 0.5,
      metalness: 0.1
    });

    const primaryMat = new THREE.MeshStandardMaterial({
      color: cfg.primaryColor,
      roughness: 0.5,
      metalness: 0.15
    });

    const secondaryMat = new THREE.MeshStandardMaterial({
      color: cfg.secondaryColor,
      roughness: 0.6,
      metalness: 0.1
    });

    const accessoryMat = new THREE.MeshStandardMaterial({
      color: cfg.accessoryColor,
      roughness: 0.3,
      metalness: 0.4
    });

    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const glowMat = new THREE.MeshStandardMaterial({
      color: cfg.accessoryColor,
      emissive: cfg.accessoryColor,
      emissiveIntensity: 0.5
    });

    // --- Pelvis / Center ---
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.9;
    root.add(pelvis);

    // --- Torso ---
    const torsoGroup = new THREE.Group();
    pelvis.add(torsoGroup);

    const torsoGeo = new THREE.BoxGeometry(0.55, 0.65, 0.32);
    const torso = new THREE.Mesh(torsoGeo, primaryMat);
    torso.position.y = 0.325;
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Torso Details based on outfit
    AvatarBuilder._addOutfitDetails(torsoGroup, cfg, primaryMat, secondaryMat, accessoryMat);

    // --- Head ---
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.75;
    torsoGroup.add(headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.15, 12);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = -0.05;
    headGroup.add(neck);

    // Head Base
    const headGeo = new THREE.BoxGeometry(0.48, 0.48, 0.46);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.22;
    head.castShadow = true;
    headGroup.add(head);

    // Face / Expression
    AvatarBuilder._addFace(headGroup, cfg, darkMat, whiteMat, glowMat, accessoryMat);

    // Hair / Hats / Headgear
    AvatarBuilder._addHeadgear(headGroup, cfg, hairMat, accessoryMat, primaryMat, glowMat);

    // --- Arms ---
    // Left Shoulder & Arm
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.38, 0.55, 0);
    torsoGroup.add(leftShoulder);

    const armGeo = new THREE.BoxGeometry(0.18, 0.55, 0.2);
    const leftArm = new THREE.Mesh(armGeo, primaryMat);
    leftArm.position.y = -0.22;
    leftArm.castShadow = true;
    leftShoulder.add(leftArm);

    // Left Hand
    const handGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.32;
    leftArm.add(leftHand);

    // Right Shoulder & Arm
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.38, 0.55, 0);
    torsoGroup.add(rightShoulder);

    const rightArm = new THREE.Mesh(armGeo, primaryMat);
    rightArm.position.y = -0.22;
    rightArm.castShadow = true;
    rightShoulder.add(rightArm);

    // Right Hand
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.32;
    rightArm.add(rightHand);

    // --- Legs ---
    // Left Hip & Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.16, 0, 0);
    pelvis.add(leftHip);

    const legGeo = new THREE.BoxGeometry(0.22, 0.65, 0.24);
    const leftLeg = new THREE.Mesh(legGeo, secondaryMat);
    leftLeg.position.y = -0.325;
    leftLeg.castShadow = true;
    leftHip.add(leftLeg);

    // Left Shoe
    const shoeGeo = new THREE.BoxGeometry(0.24, 0.18, 0.32);
    const leftShoe = new THREE.Mesh(shoeGeo, darkMat);
    leftShoe.position.set(0, -0.35, 0.04);
    leftLeg.add(leftShoe);

    // Right Hip & Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(0.16, 0, 0);
    pelvis.add(rightHip);

    const rightLeg = new THREE.Mesh(legGeo, secondaryMat);
    rightLeg.position.y = -0.325;
    rightLeg.castShadow = true;
    rightHip.add(rightLeg);

    // Right Shoe
    const rightShoe = new THREE.Mesh(shoeGeo, darkMat);
    rightShoe.position.set(0, -0.35, 0.04);
    rightLeg.add(rightShoe);

    // --- Back Gear (Wings, Jetpack, Cape, Katana, Halo) ---
    const backGroup = new THREE.Group();
    backGroup.position.set(0, 0.35, -0.18);
    torsoGroup.add(backGroup);
    AvatarBuilder._addBackGear(backGroup, cfg, accessoryMat, glowMat, primaryMat);

    // Return rig references for the procedural animator
    return {
      root,
      rig: {
        pelvis,
        torso: torsoGroup,
        head: headGroup,
        leftShoulder,
        rightShoulder,
        leftArm,
        rightArm,
        leftHip,
        rightHip,
        leftLeg,
        rightLeg,
        backGear: backGroup
      },
      config: cfg
    };
  }

  static _addOutfitDetails(group, cfg, primaryMat, secondaryMat, accessoryMat) {
    if (cfg.outfitType === 'hoodie') {
      // Hoodie pocket
      const pocketGeo = new THREE.BoxGeometry(0.38, 0.18, 0.06);
      const pocket = new THREE.Mesh(pocketGeo, secondaryMat);
      pocket.position.set(0, 0.22, 0.18);
      group.add(pocket);
    } else if (cfg.outfitType === 'space' || cfg.outfitType === 'cyber') {
      // Cyber/Space chest panel & neon stripe
      const panelGeo = new THREE.BoxGeometry(0.32, 0.28, 0.05);
      const panel = new THREE.Mesh(panelGeo, secondaryMat);
      panel.position.set(0, 0.38, 0.17);
      group.add(panel);

      const glowStripeGeo = new THREE.BoxGeometry(0.24, 0.05, 0.06);
      const glowStripe = new THREE.Mesh(glowStripeGeo, accessoryMat);
      glowStripe.position.set(0, 0.38, 0.18);
      group.add(glowStripe);
    } else if (cfg.outfitType === 'knight') {
      // Knight plate cross
      const armorGeo = new THREE.BoxGeometry(0.44, 0.48, 0.06);
      const armor = new THREE.Mesh(armorGeo, accessoryMat);
      armor.position.set(0, 0.34, 0.17);
      group.add(armor);
    }
  }

  static _addFace(headGroup, cfg, darkMat, whiteMat, glowMat, accessoryMat) {
    if (cfg.faceType === 'cool') {
      // Cool Sunglasses
      const shadesGeo = new THREE.BoxGeometry(0.46, 0.12, 0.1);
      const shades = new THREE.Mesh(shadesGeo, darkMat);
      shades.position.set(0, 0.25, 0.22);
      headGroup.add(shades);
    } else if (cfg.faceType === 'vr' || cfg.faceType === 'cyber') {
      // Glowing VR Visor
      const visorGeo = new THREE.BoxGeometry(0.48, 0.14, 0.12);
      const visor = new THREE.Mesh(visorGeo, glowMat);
      visor.position.set(0, 0.25, 0.22);
      headGroup.add(visor);
    } else {
      // Eyes (Happy / Determined / Classic)
      const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
      const leftEye = new THREE.Mesh(eyeGeo, darkMat);
      leftEye.position.set(-0.12, 0.26, 0.23);
      headGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, darkMat);
      rightEye.position.set(0.12, 0.26, 0.23);
      headGroup.add(rightEye);

      // Smile
      const smileGeo = new THREE.BoxGeometry(0.16, 0.04, 0.02);
      const smile = new THREE.Mesh(smileGeo, darkMat);
      smile.position.set(0, 0.14, 0.23);
      headGroup.add(smile);
    }
  }

  static _addHeadgear(headGroup, cfg, hairMat, accessoryMat, primaryMat, glowMat) {
    if (cfg.hairStyle === 'spiky') {
      // Spiky Anime Hair
      const hairTop = new THREE.Group();
      hairTop.position.y = 0.44;
      headGroup.add(hairTop);

      for (let i = 0; i < 7; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.12, 0.28, 4);
        const spike = new THREE.Mesh(spikeGeo, hairMat);
        const angle = (i / 7) * Math.PI * 2;
        spike.position.set(Math.cos(angle) * 0.14, 0.1, Math.sin(angle) * 0.14);
        spike.rotation.z = Math.cos(angle) * 0.4;
        spike.rotation.x = Math.sin(angle) * 0.4;
        hairTop.add(spike);
      }
      const centerSpike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 4), hairMat);
      centerSpike.position.y = 0.15;
      hairTop.add(centerSpike);
    } else if (cfg.hairStyle === 'cap') {
      // Gamer Baseball Cap
      const capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 16);
      const cap = new THREE.Mesh(capGeo, hairMat);
      cap.position.y = 0.42;
      headGroup.add(cap);

      const brimGeo = new THREE.BoxGeometry(0.34, 0.04, 0.24);
      const brim = new THREE.Mesh(brimGeo, hairMat);
      brim.position.set(0, 0.36, 0.24);
      headGroup.add(brim);
    } else if (cfg.hairStyle === 'crown') {
      // King Crown
      const crownGeo = new THREE.CylinderGeometry(0.28, 0.26, 0.2, 8);
      const crown = new THREE.Mesh(crownGeo, hairMat);
      crown.position.y = 0.46;
      headGroup.add(crown);
    } else if (cfg.hairStyle === 'astronaut') {
      // Astronaut Dome Helmet
      const helmetGeo = new THREE.SphereGeometry(0.36, 16, 16);
      const helmet = new THREE.Mesh(helmetGeo, hairMat);
      helmet.position.y = 0.24;
      headGroup.add(helmet);

      const glassGeo = new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.set(0, 0.24, 0.18);
      headGroup.add(glass);
    } else if (cfg.hairStyle === 'headphones') {
      // Gamer RGB Headphones
      const bandGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 24, Math.PI);
      const band = new THREE.Mesh(bandGeo, hairMat);
      band.position.set(0, 0.32, 0);
      band.rotation.z = Math.PI;
      headGroup.add(band);

      const earGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
      const leftEar = new THREE.Mesh(earGeo, hairMat);
      leftEar.rotation.z = Math.PI / 2;
      leftEar.position.set(-0.28, 0.22, 0);
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, hairMat);
      rightEar.rotation.z = Math.PI / 2;
      rightEar.position.set(0.28, 0.22, 0);
      headGroup.add(rightEar);
    } else if (cfg.hairStyle === 'ponytail') {
      // Ponytail Hair
      const hairBaseGeo = new THREE.BoxGeometry(0.52, 0.22, 0.5);
      const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
      hairBase.position.y = 0.38;
      headGroup.add(hairBase);

      const ponyGeo = new THREE.CylinderGeometry(0.08, 0.16, 0.45, 8);
      const pony = new THREE.Mesh(ponyGeo, hairMat);
      pony.position.set(0, 0.2, -0.32);
      pony.rotation.x = -0.5;
      headGroup.add(pony);
    }
  }

  static _addBackGear(backGroup, cfg, accessoryMat, glowMat, primaryMat) {
    if (cfg.backGear === 'wings') {
      // Dragon / Angel Wings
      const leftWingGroup = new THREE.Group();
      leftWingGroup.name = 'leftWing';
      leftWingGroup.position.set(-0.1, 0.1, 0);

      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.lineTo(-0.6, 0.4);
      wingShape.lineTo(-0.8, 0.2);
      wingShape.lineTo(-0.9, -0.1);
      wingShape.lineTo(-0.5, -0.2);
      wingShape.lineTo(0, 0);

      const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.04, bevelEnabled: false });
      const leftWing = new THREE.Mesh(wingGeo, accessoryMat);
      leftWingGroup.add(leftWing);
      backGroup.add(leftWingGroup);

      const rightWingGroup = new THREE.Group();
      rightWingGroup.name = 'rightWing';
      rightWingGroup.position.set(0.1, 0.1, 0);

      const rightWing = new THREE.Mesh(wingGeo, accessoryMat);
      rightWing.scale.x = -1;
      rightWingGroup.add(rightWing);
      backGroup.add(rightWingGroup);
    } else if (cfg.backGear === 'jetpack') {
      // Dual Booster Jetpack
      const tankGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.45, 12);
      const leftTank = new THREE.Mesh(tankGeo, primaryMat);
      leftTank.position.set(-0.16, 0.05, -0.1);
      backGroup.add(leftTank);

      const rightTank = new THREE.Mesh(tankGeo, primaryMat);
      rightTank.position.set(0.16, 0.05, -0.1);
      backGroup.add(rightTank);

      // Flame nozzles
      const nozzleGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
      const leftFlame = new THREE.Mesh(nozzleGeo, glowMat);
      leftFlame.name = 'leftFlame';
      leftFlame.rotation.x = Math.PI;
      leftFlame.position.set(-0.16, -0.25, -0.1);
      backGroup.add(leftFlame);

      const rightFlame = new THREE.Mesh(nozzleGeo, glowMat);
      rightFlame.name = 'rightFlame';
      rightFlame.rotation.x = Math.PI;
      rightFlame.position.set(0.16, -0.25, -0.1);
      backGroup.add(rightFlame);
    } else if (cfg.backGear === 'cape') {
      // Hero Fluttering Cape
      const capeGeo = new THREE.BoxGeometry(0.48, 0.75, 0.04);
      const cape = new THREE.Mesh(capeGeo, accessoryMat);
      cape.name = 'capeMesh';
      cape.position.set(0, -0.15, -0.06);
      cape.rotation.x = 0.15;
      backGroup.add(cape);
    } else if (cfg.backGear === 'katana') {
      // Cyber / Ninja Katana
      const scabbardGeo = new THREE.BoxGeometry(0.06, 0.9, 0.06);
      const scabbard = new THREE.Mesh(scabbardGeo, accessoryMat);
      scabbard.position.set(0, 0.1, -0.08);
      scabbard.rotation.z = -0.7;
      backGroup.add(scabbard);
    } else if (cfg.backGear === 'halo') {
      // Floating Angel Halo
      const haloGeo = new THREE.TorusGeometry(0.24, 0.03, 8, 24);
      const halo = new THREE.Mesh(haloGeo, glowMat);
      halo.position.set(0, 0.65, 0.15);
      halo.rotation.x = Math.PI / 2;
      backGroup.add(halo);
    }
  }
}
