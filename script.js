const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
import { EffectComposer } from "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "./node_modules/three/examples/jsm/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "./node_modules/three/examples/jsm/postprocessing/BokehPass.js";

//TODO poner algo de audio https://threejs.org/docs/index.html#api/en/audio/Audio

class World {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.sphereElement = new Sphere();
    this.planeElement = new Plane();
    this.firstLine = new Quote("Home is not where you are born;", [0, 1, 5]);
    this.secondLine = new Quote("home is where all your attempts", [0, 0, 5]);
    this.thirdLine = new Quote(
      "to escape cease",
      [0, -1, 5],
      this.init.bind(this)
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls;
    this.ambientLight = new THREE.AmbientLight(0x404040, 2.5);
    this.pointLight = new THREE.PointLight(0x0377fc, 0.5, 100, 2);
    this.secondaryPointLight = new THREE.PointLight(0xfcba03, 1, 100, 5);

    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize, false);

    this.hue = 0;

    this.composer = new EffectComposer(this.renderer);
    this.composer2 = new EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
    );

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.renderPass2 = new RenderPass(this.scene, this.camera);

    this.bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 0.01,
      aspect: this.camera.aspect,
      aperture: 0.0004,
      maxblur: 0.7,

      width: window.innerWidth,
      height: window.innerHeight
    });
    this.glitchPass = new GlitchPass();
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.composer2.setSize(window.innerWidth, window.innerHeight);

    this.composer.addPass(this.renderPass);
    this.composer2.addPass(this.renderPass2);

    this.composer2.addPass(this.bokehPass);

    this.composer.addPass(this.glitchPass);
    // this.bokehPass.renderToScreen = true;
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.background = new THREE.Color(0xaaccff);
    this.pointLight.position.set(0, 6, 20);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.near = 0.1;
    this.pointLight.shadow.camera.far = 200;
    this.secondaryPointLight.position.set(10, 10, 20);
    this.secondaryPointLight.castShadow = true;
    this.scene.add(this.ambientLight);
    this.scene.add(this.pointLight);
    this.scene.add(this.secondaryPointLight);
    //TODO do the fog
    this.scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
    this.scene.add(this.sphereElement.sphere);
    this.scene.add(this.planeElement.plane);
    this.scene.add(this.firstLine.text);
    this.scene.add(this.secondLine.text);
    this.scene.add(this.thirdLine.text);
    // this.camera.position.set(7, -2.7, 7);
    this.camera.position.set(6, -0.7, 6.5);
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.sphereElement.sphere.rotation.x += 0.01;
    this.sphereElement.sphere.rotation.y += 0.01;

    this.firstLine.material.color.set(
      new THREE.Color(`hsl(${this.hue}, 70%, 85%)`)
    );
    this.secondLine.material.color.set(
      new THREE.Color(`hsl(${this.hue}, 70%, 85%)`)
    );
    this.thirdLine.material.color.set(
      new THREE.Color(`hsl(${this.hue}, 70%, 85%)`)
    );

    if (this.hue == 359) this.hue = 0;
    else this.hue++;

    // this.sphereElement.animateSurface();
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
    this.composer2.render();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

class Sphere {
  constructor() {
    this.geometry = new THREE.SphereGeometry(1.2, 32, 32);
    // debugger
    this.material = new THREE.MeshPhongMaterial({ color: 0xff5733 });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
    this.grow = true;
    this.init = this.init.bind(this);
    this.animateSurface = this.animateSurface.bind(this);
    this.init();
  }

  init() {
    this.sphere.receiveShadow = true;
    this.sphere.castShadow = true;
  }

  animateSurface() {
    // var position = this.geometry.attributes.position;
    // debugger
    // this.geometry.attributes.position.usage = THREE.DynamicDrawUsage;
    // for (let i = 0; i < this.geometry.attributes.position.count; i++) {
    //   // let xyz = [Math.random() * (1.5 - -1.5) + -1.5, Math.random() * (1.5 - -1.5) + -1.5, Math.random() * (1.5 - -1.5) + -1.5]
    //   let xyz = [
    //     Math.random() * (0.1 - -0.1) + -0.1 * Math.sin(i / 2),
    //     Math.random() * (0.1 - -0.1) + -0.1 * Math.sin(i / 2),
    //     Math.random() * (0.1 - -0.1) + -0.1 * Math.sin(i / 2)
    //   ];
    //   // var y = 35 * Math.sin(i / 2);
    //   this.geometry.attributes.position.setXYZ(i, ...xyz);
    // }
    // // debugger
    // this.geometry.attributes.position.needsUpdate = true;

    // for (let i = 0; i < this.geometry.attributes.position.count; i++) {
    //   // let xyz = [Math.random() * (1.5 - -1.5) + -1.5, Math.random() * (1.5 - -1.5) + -1.5, Math.random() * (1.5 - -1.5) + -1.5]
    //   let xyz = [
    //     Math.random() * (0.1 - -0.1) + -0.1 * Math.sin(i / 2),
    //     Math.random() * (0.1 - -0.1) + -0.1 * Math.sin(i / 2),
    //     Math.random() * (0.1 - -0.1) + -0.1 * Math.sin(i / 2)
    //   ];
    //   // var y = 35 * Math.sin(i / 2);
    //   this.geometry.attributes.position.setXYZ(i, ...xyz);
    // }

    if (this.grow) {
      this.sphere.scale.x = parseFloat((this.sphere.scale.z + 0.01).toFixed(2));
      this.sphere.scale.y = parseFloat((this.sphere.scale.z + 0.01).toFixed(2));
      this.sphere.scale.z = parseFloat((this.sphere.scale.z + 0.01).toFixed(2));
    } else if (!this.grow) {
      this.sphere.scale.x = parseFloat((this.sphere.scale.z - 0.01).toFixed(2));
      this.sphere.scale.y = parseFloat((this.sphere.scale.z - 0.01).toFixed(2));
      this.sphere.scale.z = parseFloat((this.sphere.scale.z - 0.01).toFixed(2));
    }
    if (this.sphere.scale.x == 3) this.grow = false;
    if (this.sphere.scale.x == 1) this.grow = true;
    // console.log(this.sphere.scale.x, this.grow)
    // this.geometry.parameters.radius.needsUpdate = true

    // debugger
  }
}

class Plane {
  constructor() {
    this.geometry = new THREE.PlaneBufferGeometry(2000, 2000);
    // this.material = new THREE.ShadowMaterial({
    //   opacity: 0.15
    // });
    this.material = new THREE.MeshPhongMaterial({ color: 0xaaccff });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.init = this.init.bind(this);
    this.init();
  }
  init() {
    this.plane.position.y = -15;
    this.plane.position.x = 0;
    this.plane.position.z = 0;
    this.plane.rotation.x = (Math.PI / 180) * -30;
    this.plane.receiveShadow = true;
  }
}

class Quote {
  constructor(qt, coordinates, cb) {
    this.qt = qt;
    this.textLoader = new THREE.FontLoader();
    this.geometry;
    this.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color("hsl(0, 70%, 85%)")
    });
    this.text;
    this.init = this.init.bind(this);
    this.init(coordinates, cb);
  }

  init(coordinates, cb) {
    this.textLoader.load("fonts/Dosis_Regular.json", font => {
      this.geometry = new THREE.TextBufferGeometry(this.qt, {
        font: font,
        size: 0.7,
        height: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02
      });
      this.geometry.center();
      this.text = new THREE.Mesh(this.geometry, this.material);
      this.text.position.set(...coordinates);
      this.text.receiveShadow = true;
      this.text.castShadow = true;
      if (cb) cb();
    });
  }
}

const world = new World();
