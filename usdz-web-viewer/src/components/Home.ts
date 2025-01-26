import { Component, Ref, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DataTexture } from "three";
import { USDZInstance } from "three-usdz-loader/lib/USDZInstance";
import { USDZLoader } from "three-usdz-loader";

@Component
export default class Home extends Vue {
  @Ref("three-container") threeContainer!: HTMLElement;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  currentFileName!: string;
  controls!: OrbitControls;

  modelIsVisible = false;
  modelIsLoading = false;
  hasUrlParam = false;
  dialog = false;
  loadedModels: USDZInstance[] = [];
  loader!: USDZLoader;
  error: string | null = null;
  loaderReady: boolean | null = null;

  async loadModelFromUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const fileName = url.split('/').pop() || 'model.usdz';
      const file = new File([blob], fileName, { type: 'model/vnd.usd+zip' });
      await this.loadFile(file);
    } catch (e) {
      this.error = e as string;
      console.error('Failed to load model from URL:', e);
    }
  }

  async mounted(): Promise<void> {
    // Check for URL parameter and load the model if present
    const urlParams = new URLSearchParams(window.location.search);
    const modelUrl = urlParams.get('url');
    console.log(modelUrl);
    if (modelUrl) {
      this.loadModelFromUrl(modelUrl);
      this.hasUrlParam = true;
    }
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      27,
      window.innerWidth / window.innerHeight,
      1,
      3500
    );
    this.camera.position.z = 7;
    this.camera.position.y = 7;
    this.camera.position.x = 0;

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Setup light
    const ambiantLight = new THREE.AmbientLight(0x111111);
    ambiantLight.intensity = 1;
    this.scene.add(ambiantLight);

    // Setup main scene
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;

    // Setup cubemap for reflection
    await new Promise((resolve) => {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileCubemapShader();
      new RGBELoader().load(
        "studio_country_hall_1k.hdr",
        (texture: DataTexture) => {
          const hdrRenderTarget = pmremGenerator.fromEquirectangular(texture);

          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.needsUpdate = true;
          window.envMap = hdrRenderTarget.texture;
          hdrRenderTarget.texture.colorSpace = THREE.LinearSRGBColorSpace;
          resolve(true);
        }
      );
    });

    // Add the canvas to the document
    this.threeContainer.appendChild(this.renderer.domElement);

    // Setup navigation
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // Setup main animation update loop
    this.animate();

    // Setup the USDZ loader
    this.loader = new USDZLoader("/wasm");

    // Setup windows events
    window.addEventListener("resize", this.onWindowResize);
  }

  async animate(): Promise<void> {
    const secs = new Date().getTime() / 1000;
    await new Promise((resolve) => setTimeout(resolve, 10));

    for (const loadedModel of this.loadedModels) {
      loadedModel.update(secs);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(null));
  }

  async loadFile(file: File): Promise<void> {
    if (this.modelIsLoading) {
      return;
    }

    this.modelIsLoading = true;
    this.error = null;

    for (const el of this.loadedModels) {
      el.clear();
    }
    this.loadedModels = [];

    const group = new THREE.Group();
    this.scene.add(group);

    try {
      const loadedModel = await this.loader.loadFile(file, group);
      this.loadedModels.push(loadedModel);
    } catch (e) {
      this.error = e as string;
      console.error("An error occured when trying to load the model" + e);
      this.modelIsLoading = false;
      return;
    }

    const allContainers = this.loadedModels.map((el: USDZInstance) => {
      return el.getGroup();
    });
    this.fitCamera(this.camera, this.controls, allContainers);

    this.modelIsLoading = false;
    this.modelIsVisible = true;
  }

  fitCamera(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    selection: THREE.Group[],
    fitOffset = 1.5
  ): void {
    const cam = camera as THREE.PerspectiveCamera;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    const box = new THREE.Box3();

    box.makeEmpty();
    for (const object of selection) {
      box.expandByObject(object);
    }

    box.getSize(size);
    box.getCenter(center);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance =
      maxSize / (2 * Math.atan((Math.PI * cam.fov) / 360));
    const fitWidthDistance = fitHeightDistance / cam.aspect;
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = controls.target
      .clone()
      .sub(cam.position)
      .normalize()
      .multiplyScalar(distance);

    controls.maxDistance = distance * 10;
    controls.target.copy(center);

    cam.near = distance / 100;
    cam.far = distance * 100;
    cam.updateProjectionMatrix();

    camera.position.copy(controls.target).sub(direction);

    controls.update();
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}