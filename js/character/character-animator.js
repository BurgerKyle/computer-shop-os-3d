// Procedural Rig Animator for Three.js Humanoid Avatar
import * as THREE from 'three';

export class CharacterAnimator {
  constructor(rig, soundFX = null) {
    this.rig = rig;
    this.soundFX = soundFX;
    this.state = 'idle'; // 'idle' | 'walk' | 'run' | 'jump' | 'dance' | 'wave'
    this.speed = 0;
    this.time = 0;
    this.stepTimer = 0;
  }

  setState(state) {
    this.state = state;
  }

  update(delta, moveSpeed = 0, isGrounded = true) {
    this.time += delta;
    this.speed = moveSpeed;

    const r = this.rig;
    if (!r) return;

    if (!isGrounded) {
      this._animateJump(delta);
    } else if (this.state === 'dance') {
      this._animateDance(delta);
    } else if (this.state === 'wave') {
      this._animateWave(delta);
    } else if (moveSpeed > 0.1) {
      const isRunning = moveSpeed > 5.5;
      this._animateWalk(delta, isRunning ? 1.6 : 1.0);
    } else {
      this._animateIdle(delta);
    }

    // Secondary animations (wings, jetpack, cape)
    this._animateAccessories(delta);
  }

  _animateIdle(delta) {
    const r = this.rig;
    const t = this.time * 2.5;

    // Subtle breathing
    r.torso.position.y = Math.sin(t) * 0.02;
    r.head.position.y = 0.75 + Math.sin(t + 0.5) * 0.015;

    // Relaxed arms
    r.leftShoulder.rotation.x = THREE.MathUtils.lerp(r.leftShoulder.rotation.x, Math.sin(t) * 0.05, 0.1);
    r.rightShoulder.rotation.x = THREE.MathUtils.lerp(r.rightShoulder.rotation.x, -Math.sin(t) * 0.05, 0.1);
    r.leftShoulder.rotation.z = THREE.MathUtils.lerp(r.leftShoulder.rotation.z, 0.05, 0.1);
    r.rightShoulder.rotation.z = THREE.MathUtils.lerp(r.rightShoulder.rotation.z, -0.05, 0.1);

    // Straight legs
    r.leftHip.rotation.x = THREE.MathUtils.lerp(r.leftHip.rotation.x, 0, 0.1);
    r.rightHip.rotation.x = THREE.MathUtils.lerp(r.rightHip.rotation.x, 0, 0.1);
    r.pelvis.position.y = THREE.MathUtils.lerp(r.pelvis.position.y, 0.9, 0.1);
  }

  _animateWalk(delta, speedMultiplier = 1.0) {
    const r = this.rig;
    const freq = 9.0 * speedMultiplier;
    const t = this.time * freq;

    // Legs swing
    const legAngle = Math.sin(t) * 0.75;
    r.leftHip.rotation.x = legAngle;
    r.rightHip.rotation.x = -legAngle;

    // Arms swing in opposite phase
    const armAngle = Math.sin(t) * 0.7;
    r.leftShoulder.rotation.x = -armAngle;
    r.rightShoulder.rotation.x = armAngle;
    r.leftShoulder.rotation.z = 0.1;
    r.rightShoulder.rotation.z = -0.1;

    // Hips & Torso bobbing
    r.pelvis.position.y = 0.9 + Math.abs(Math.sin(t)) * 0.08;
    r.torso.rotation.y = Math.sin(t) * 0.1;

    // Sound effect trigger on step down
    this.stepTimer += delta * freq;
    if (this.stepTimer >= Math.PI) {
      this.stepTimer -= Math.PI;
      if (this.soundFX) {
        this.soundFX.playFootstep();
      }
    }
  }

  _animateJump(delta) {
    const r = this.rig;

    // Arms up
    r.leftShoulder.rotation.x = THREE.MathUtils.lerp(r.leftShoulder.rotation.x, -1.8, 0.2);
    r.rightShoulder.rotation.x = THREE.MathUtils.lerp(r.rightShoulder.rotation.x, -1.8, 0.2);
    r.leftShoulder.rotation.z = THREE.MathUtils.lerp(r.leftShoulder.rotation.z, 0.4, 0.2);
    r.rightShoulder.rotation.z = THREE.MathUtils.lerp(r.rightShoulder.rotation.z, -0.4, 0.2);

    // Legs tucked
    r.leftHip.rotation.x = THREE.MathUtils.lerp(r.leftHip.rotation.x, 0.6, 0.2);
    r.rightHip.rotation.x = THREE.MathUtils.lerp(r.rightHip.rotation.x, 0.3, 0.2);
  }

  _animateDance(delta) {
    const r = this.rig;
    const t = this.time * 6.0;

    r.pelvis.position.y = 0.9 + Math.abs(Math.sin(t)) * 0.12;
    r.pelvis.rotation.y = Math.sin(t * 0.5) * 0.6;

    r.leftShoulder.rotation.x = Math.sin(t) * 1.2;
    r.rightShoulder.rotation.x = Math.cos(t) * 1.2;
    r.leftShoulder.rotation.z = Math.abs(Math.sin(t)) * 0.6;
    r.rightShoulder.rotation.z = -Math.abs(Math.sin(t)) * 0.6;

    r.leftHip.rotation.x = Math.sin(t) * 0.4;
    r.rightHip.rotation.x = -Math.sin(t) * 0.4;
  }

  _animateWave(delta) {
    const r = this.rig;
    const t = this.time * 8.0;

    // Right arm raised and waving
    r.rightShoulder.rotation.x = -2.2;
    r.rightShoulder.rotation.z = -0.4 + Math.sin(t) * 0.4;

    // Left arm relaxed
    r.leftShoulder.rotation.x = 0;
    r.leftShoulder.rotation.z = 0.1;

    r.leftHip.rotation.x = 0;
    r.rightHip.rotation.x = 0;
  }

  _animateAccessories(delta) {
    const bg = this.rig.backGear;
    if (!bg) return;

    // Flap Wings
    const leftWing = bg.getObjectByName('leftWing');
    const rightWing = bg.getObjectByName('rightWing');
    if (leftWing && rightWing) {
      const wingFlap = Math.sin(this.time * 5.0) * 0.35;
      leftWing.rotation.y = wingFlap;
      rightWing.rotation.y = -wingFlap;
    }

    // Flicker Jetpack Flames
    const leftFlame = bg.getObjectByName('leftFlame');
    const rightFlame = bg.getObjectByName('rightFlame');
    if (leftFlame && rightFlame) {
      const flicker = 0.8 + Math.random() * 0.4;
      leftFlame.scale.set(flicker, flicker * 1.2, flicker);
      rightFlame.scale.set(flicker, flicker * 1.2, flicker);
    }

    // Flutter Cape
    const cape = bg.getObjectByName('capeMesh');
    if (cape) {
      cape.rotation.x = 0.2 + (this.speed > 0.1 ? 0.6 : 0.05) + Math.sin(this.time * 8.0) * 0.15;
    }
  }
}
