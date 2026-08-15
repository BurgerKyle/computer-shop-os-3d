// High-Precision Third-Person Character Physics & Camera Controller
import * as THREE from 'three';

export class CharacterController {
  constructor(characterRoot, rig, animator, camera, domElement, soundFX = null) {
    this.character = characterRoot;
    this.rig = rig;
    this.animator = animator;
    this.camera = camera;
    this.domElement = domElement;
    this.soundFX = soundFX;

    // Movement Tuning (Snappy, Responsive & Fluid)
    this.walkSpeed = 7.5;
    this.runSpeed = 12.0;
    this.accel = 45.0;
    this.friction = 14.0;
    this.jumpForce = 9.5;
    this.gravity = 24.0;

    // Physics State
    this.velocity = new THREE.Vector3();
    this.currentSpeed = 0;
    this.isGrounded = true;
    this.coyoteTime = 0;
    this.jumpBuffer = 0;

    // Input States
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };

    // Camera Spring-Arm Configuration
    this.targetPos = new THREE.Vector3();
    this.cameraDistance = 7.0;
    this.targetCameraDistance = 7.0;
    this.cameraHeight = 3.2;
    this.cameraPitch = 0.28;
    this.cameraYaw = 0;
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.baseFov = camera.fov || 58;

    // Pre-allocated vectors for ZERO GC in animation loop
    this._moveDir = new THREE.Vector3();
    this._desiredVel = new THREE.Vector3();
    this._camOffset = new THREE.Vector3();
    this._desiredCamPos = new THREE.Vector3();

    // 3D Billboard Name Tag
    this.nameTag = null;

    this._initInputs();
  }

  _initInputs() {
    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this._onKeyUp(e));

    // Smooth Mouse Orbit
    this.domElement.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos.x = e.clientX;
      this.prevMousePos.y = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;
      this.prevMousePos.x = e.clientX;
      this.prevMousePos.y = e.clientY;

      this.cameraYaw -= deltaX * 0.0055;
      this.cameraPitch = Math.max(-0.25, Math.min(1.25, this.cameraPitch + deltaY * 0.0045));
    });

    // Zoom
    window.addEventListener('wheel', (e) => {
      this.targetCameraDistance = Math.max(3.5, Math.min(15.0, this.targetCameraDistance + e.deltaY * 0.004));
    }, { passive: true });
  }

  _onKeyDown(e) {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = true;
        break;
      case 'Space':
        this.jumpBuffer = 0.15; // Jump buffer for responsive feel
        break;
      case 'KeyG':
        if (this.animator) this.animator.setState(this.animator.state === 'dance' ? 'idle' : 'dance');
        break;
      case 'KeyH':
        if (this.animator) this.animator.setState(this.animator.state === 'wave' ? 'idle' : 'wave');
        break;
    }
  }

  _onKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = false;
        break;
    }
  }

  setJoystickInput(x, y) {
    this.keys.forward = y < -0.25;
    this.keys.backward = y > 0.25;
    this.keys.left = x < -0.25;
    this.keys.right = x > 0.25;
  }

  jump() {
    this.jumpBuffer = 0.15;
  }

  update(delta, islandRadius = 38) {
    if (!this.character) return;

    // Clamp delta to prevent simulation exploding on low framerate/tab switch
    const dt = Math.min(delta, 0.05);

    // Timers
    if (this.isGrounded) {
      this.coyoteTime = 0.12;
    } else {
      this.coyoteTime -= dt;
    }

    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= dt;
    }

    // Process Jump with buffer & coyote time
    if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
      if (this.soundFX) this.soundFX.playJump();
    }

    // Calculate Movement Direction (Zero-GC reuse)
    this._moveDir.set(0, 0, 0);
    if (this.keys.forward) this._moveDir.z -= 1;
    if (this.keys.backward) this._moveDir.z += 1;
    if (this.keys.left) this._moveDir.x -= 1;
    if (this.keys.right) this._moveDir.x += 1;

    const hasInput = this._moveDir.lengthSq() > 0.001;

    if (hasInput) {
      this._moveDir.normalize();

      // Rotate move direction relative to camera yaw
      this._moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

      const targetMaxSpeed = this.keys.sprint ? this.runSpeed : this.walkSpeed;

      this._desiredVel.copy(this._moveDir).multiplyScalar(targetMaxSpeed);

      // Accelerate towards desired velocity
      this.velocity.x += (this._desiredVel.x - this.velocity.x) * Math.min(1, this.accel * dt);
      this.velocity.z += (this._desiredVel.z - this.velocity.z) * Math.min(1, this.accel * dt);

      // Snappy character facing angle
      const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
      this.character.rotation.y = THREE.MathUtils.lerp(
        this.character.rotation.y,
        targetAngle,
        Math.min(1, 16.0 * dt)
      );

      // Subtle Banking / Lean into turn
      if (this.rig && this.rig.torso) {
        const turnSpeed = (targetAngle - this.character.rotation.y);
        this.rig.torso.rotation.z = THREE.MathUtils.lerp(
          this.rig.torso.rotation.z,
          -turnSpeed * 0.3,
          0.2
        );
      }
    } else {
      // Snappy Deceleration Friction
      this.velocity.x += (0 - this.velocity.x) * Math.min(1, this.friction * dt);
      this.velocity.z += (0 - this.velocity.z) * Math.min(1, this.friction * dt);

      if (this.rig && this.rig.torso) {
        this.rig.torso.rotation.z = THREE.MathUtils.lerp(this.rig.torso.rotation.z, 0, 0.2);
      }
    }

    this.currentSpeed = Math.hypot(this.velocity.x, this.velocity.z);

    // Apply Gravity
    this.velocity.y -= this.gravity * dt;
    this.character.position.y += this.velocity.y * dt;

    // Ground Collision (Y = 0)
    if (this.character.position.y <= 0) {
      if (!this.isGrounded && this.soundFX) {
        this.soundFX.playLand();
      }
      this.character.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Apply Horizontal Velocity
    this.character.position.x += this.velocity.x * dt;
    this.character.position.z += this.velocity.z * dt;

    // Island Radius Clamp
    const distSq = this.character.position.x * this.character.position.x + this.character.position.z * this.character.position.z;
    if (distSq > islandRadius * islandRadius) {
      const dist = Math.sqrt(distSq);
      const factor = islandRadius / dist;
      this.character.position.x *= factor;
      this.character.position.z *= factor;
      this.velocity.x *= 0.5;
      this.velocity.z *= 0.5;
    }

    // Update Animator
    if (this.animator) {
      this.animator.update(dt, this.currentSpeed, this.isGrounded);
    }

    // Update Camera
    this._updateCamera(dt);
  }

  _updateCamera(dt) {
    // Smooth camera distance zoom
    this.cameraDistance = THREE.MathUtils.lerp(this.cameraDistance, this.targetCameraDistance, 0.1);

    // Dynamic FOV shift during sprint
    const targetFov = (this.keys.sprint && this.currentSpeed > 8) ? this.baseFov + 8 : this.baseFov;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 0.1);
      this.camera.updateProjectionMatrix();
    }

    // Target focus point on character
    this.targetPos.set(
      this.character.position.x,
      this.character.position.y + 1.35,
      this.character.position.z
    );

    // Calculate Spherical Orbit Position
    const cosPitch = Math.cos(this.cameraPitch);
    this._camOffset.set(
      Math.sin(this.cameraYaw) * cosPitch * this.cameraDistance,
      Math.sin(this.cameraPitch) * this.cameraDistance + this.cameraHeight,
      Math.cos(this.cameraYaw) * cosPitch * this.cameraDistance
    );

    this._desiredCamPos.copy(this.targetPos).add(this._camOffset);

    // High-responsiveness Camera Lag
    this.camera.position.lerp(this._desiredCamPos, Math.min(1, 14.0 * dt));
    this.camera.lookAt(this.targetPos);
  }

  attachNameTag(name, ageGroup) {
    if (this.nameTag) {
      this.character.remove(this.nameTag);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    // Cyber Glass Pill
    ctx.fillStyle = 'rgba(10, 15, 29, 0.88)';
    ctx.roundRect(10, 10, 280, 70, 35);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = ageGroup === 'teen' ? '#9333ea' : '#00f2fe';
    ctx.stroke();

    // Name text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 150, 52);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.0, 0.6, 1);
    sprite.position.y = 2.45;

    this.character.add(sprite);
    this.nameTag = sprite;
  }
}
