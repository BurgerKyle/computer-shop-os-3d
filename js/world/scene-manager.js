// High-Performance Three.js Scene Manager (Optimized for 60/120 FPS)
import * as THREE from 'three';

export class SceneManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060b19, 0.007);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      800
    );
    this.camera.position.set(0, 10, 20);

    // High-performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio to 1.25 to guarantee 60-120 FPS on all monitors
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.clouds = [];
    this.particles = null;

    this._setupCosmicSky();
    this._setupLighting();
    this._setupAtmosphere();
    this._initResize();
  }

  _setupCosmicSky() {
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      
      void main() {
        float h = normalize( vWorldPosition + offset ).y;
        vec3 col = mix( horizonColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) );
        if (h < 0.0) {
          col = mix( horizonColor, bottomColor, min( pow( -h, 0.8 ), 1.0 ) );
        }
        gl_FragColor = vec4( col, 1.0 );
      }
    `;

    const uniforms = {
      topColor: { value: new THREE.Color(0x030712) },
      horizonColor: { value: new THREE.Color(0x0f2744) },
      bottomColor: { value: new THREE.Color(0x050814) },
      offset: { value: 20 },
      exponent: { value: 0.5 }
    };

    const skyGeo = new THREE.SphereGeometry(350, 16, 12);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.BackSide,
      depthWrite: false
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  _setupLighting() {
    // 1. Soft cyber hemisphere ambient
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x090d16, 1.2);
    hemiLight.position.set(0, 60, 0);
    this.scene.add(hemiLight);

    // 2. Primary Key Sun Light (Sole Shadow Caster)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(30, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    sunLight.shadow.bias = -0.0006;
    this.scene.add(sunLight);

    // 3. Subtle Cyan Rim Fill
    const cyanRim = new THREE.DirectionalLight(0x00f2fe, 0.8);
    cyanRim.position.set(-30, 20, -30);
    this.scene.add(cyanRim);
  }

  _setupAtmosphere() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x0f172a,
      emissiveIntensity: 0.2,
      roughness: 0.9,
      transparent: true,
      opacity: 0.8
    });

    const puffGeos = [
      new THREE.DodecahedronGeometry(3.5, 0),
      new THREE.DodecahedronGeometry(4.5, 0)
    ];

    for (let i = 0; i < 10; i++) {
      const cloudGroup = new THREE.Group();
      const numPuffs = 3;

      for (let p = 0; p < numPuffs; p++) {
        const puff = new THREE.Mesh(puffGeos[p % puffGeos.length], cloudMat);
        puff.position.set(
          (p - numPuffs / 2) * 3.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2.5
        );
        cloudGroup.add(puff);
      }

      const angle = (i / 10) * Math.PI * 2;
      const distance = 55 + Math.random() * 35;
      const height = -10 + (Math.random() - 0.5) * 12;

      cloudGroup.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );

      cloudGroup.userData = {
        speed: 0.08 + Math.random() * 0.1,
        dist: distance,
        angle: angle,
        initialY: height
      };

      this.scene.add(cloudGroup);
      this.clouds.push(cloudGroup);
    }

    // Glowing Stardust / Cyber Energy Motes
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 70;
      posArray[i + 1] = Math.random() * 20 - 1;
      posArray[i + 2] = (Math.random() - 0.5) * 70;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particles);
  }

  _initResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  update(delta) {
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      c.userData.angle += delta * 0.01 * c.userData.speed;
      c.position.x = Math.cos(c.userData.angle) * c.userData.dist;
      c.position.z = Math.sin(c.userData.angle) * c.userData.dist;
    }

    if (this.particles) {
      this.particles.rotation.y += delta * 0.015;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
