// High-Performance Three.js Scene Manager with Visible Celestial Sun, Dynamic Shadows & Specular Reflections
import * as THREE from 'three';

export class SceneManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060b19, 0.0055);

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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.clouds = [];
    this.particles = null;
    this.sunGroup = null;

    this._setupCosmicSky();
    this._setupVisibleCelestialSunAndLighting();
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

    const skyGeo = new THREE.SphereGeometry(450, 16, 12);
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

  _setupVisibleCelestialSunAndLighting() {
    const sunPos = new THREE.Vector3(75, 95, -50);

    // ☀️ 1. VISIBLE 3D CELESTIAL SUN IN THE SKY
    this.sunGroup = new THREE.Group();
    this.sunGroup.position.copy(sunPos);

    // Sun Core Sphere (Ultra-Bright Golden-White Core)
    const sunCoreGeo = new THREE.SphereGeometry(7.0, 24, 24);
    const sunCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    this.sunGroup.add(sunCore);

    // Inner Glowing Corona Halo
    const innerCoronaGeo = new THREE.SphereGeometry(9.5, 20, 20);
    const innerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const innerCorona = new THREE.Mesh(innerCoronaGeo, innerCoronaMat);
    this.sunGroup.add(innerCorona);

    // Outer Radiant Atmospheric Glow Halo
    const outerCoronaGeo = new THREE.SphereGeometry(14.0, 16, 16);
    const outerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const outerCorona = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
    this.sunGroup.add(outerCorona);

    // Radiant Sun Flare Star Rays
    const flareRayGeo = new THREE.OctahedronGeometry(18.0, 0);
    const flareRayMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const flareRays = new THREE.Mesh(flareRayGeo, flareRayMat);
    this.sunGroup.add(flareRays);
    this.sunGroup.userData.flareRays = flareRays;

    this.scene.add(this.sunGroup);

    // 💡 2. SUN DIRECTIONAL LIGHT (Main Dynamic Shadow Caster)
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    sunLight.position.copy(sunPos);
    sunLight.target.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 260;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    this.scene.add(sunLight);
    this.scene.add(sunLight.target);

    // 💡 3. Natural Atmosphere Bounce (Sky Blue Top + Warm Turf Ambient)
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x064e3b, 1.4);
    hemiLight.position.set(0, 80, 0);
    this.scene.add(hemiLight);

    // 💡 4. Subtle Cyber Rim Fill
    const cyanRim = new THREE.DirectionalLight(0x00f2fe, 0.75);
    cyanRim.position.set(-60, 30, 60);
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
      const distance = 60 + Math.random() * 35;
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

    // Glowing Stardust / Cyber Motes
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 80;
      posArray[i + 1] = Math.random() * 25 - 1;
      posArray[i + 2] = (Math.random() - 0.5) * 80;
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
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      c.userData.angle += delta * 0.01 * c.userData.speed;
      c.position.x = Math.cos(c.userData.angle) * c.userData.dist;
      c.position.z = Math.sin(c.userData.angle) * c.userData.dist;
    }

    if (this.particles) {
      this.particles.rotation.y += delta * 0.015;
    }

    if (this.sunGroup && this.sunGroup.userData.flareRays) {
      this.sunGroup.userData.flareRays.rotation.y += delta * 0.08;
      this.sunGroup.userData.flareRays.rotation.z += delta * 0.05;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
