// High-Performance Three.js Scene Manager with AAA Frontier Visuals
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
      1000
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    // Custom Cosmic Nebula & Aurora Sky Shader
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
      topColor: { value: new THREE.Color(0x030712) },     // Deep space black/indigo
      horizonColor: { value: new THREE.Color(0x0f2744) }, // Twilight cyber teal/cyan
      bottomColor: { value: new THREE.Color(0x050814) },  // Abyss depth
      offset: { value: 20 },
      exponent: { value: 0.5 }
    };

    const skyGeo = new THREE.SphereGeometry(450, 24, 16);
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
    // Soft cyber hemisphere ambient
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x090d16, 1.1);
    hemiLight.position.set(0, 60, 0);
    this.scene.add(hemiLight);

    // Primary Sun Key Light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(35, 55, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 140;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0008;
    this.scene.add(sunLight);

    // Cyan Horizon Rim Light
    const cyanRim = new THREE.DirectionalLight(0x00f2fe, 1.4);
    cyanRim.position.set(-35, 20, -35);
    this.scene.add(cyanRim);

    // Purple Accent Fill
    const purpleRim = new THREE.DirectionalLight(0x9333ea, 0.9);
    purpleRim.position.set(30, -10, -20);
    this.scene.add(purpleRim);
  }

  _setupAtmosphere() {
    // Optimized Volumetric Clouds with shared material and geometries
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x0f172a,
      emissiveIntensity: 0.2,
      roughness: 0.9,
      transparent: true,
      opacity: 0.82
    });

    const puffGeos = [
      new THREE.DodecahedronGeometry(3.5, 0),
      new THREE.DodecahedronGeometry(5.0, 0),
      new THREE.DodecahedronGeometry(2.5, 0)
    ];

    for (let i = 0; i < 16; i++) {
      const cloudGroup = new THREE.Group();
      const numPuffs = 4;

      for (let p = 0; p < numPuffs; p++) {
        const puff = new THREE.Mesh(puffGeos[p % puffGeos.length], cloudMat);
        puff.position.set(
          (p - numPuffs / 2) * 3.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2.5
        );
        cloudGroup.add(puff);
      }

      const angle = (i / 16) * Math.PI * 2;
      const distance = 55 + Math.random() * 45;
      const height = -10 + (Math.random() - 0.5) * 16;

      cloudGroup.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );

      cloudGroup.userData = {
        speed: 0.08 + Math.random() * 0.12,
        dist: distance,
        angle: angle,
        initialY: height
      };

      this.scene.add(cloudGroup);
      this.clouds.push(cloudGroup);
    }

    // Glowing Stardust / Cyber Energy Motes
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 75;
      posArray[i + 1] = Math.random() * 24 - 1;
      posArray[i + 2] = (Math.random() - 0.5) * 75;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.75,
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
    // Rotate and drift clouds
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      c.userData.angle += delta * 0.012 * c.userData.speed;
      c.position.x = Math.cos(c.userData.angle) * c.userData.dist;
      c.position.z = Math.sin(c.userData.angle) * c.userData.dist;
      c.position.y = c.userData.initialY + Math.sin(c.userData.angle * 3.0) * 1.2;
    }

    // Float cyber particles
    if (this.particles) {
      this.particles.rotation.y += delta * 0.02;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
