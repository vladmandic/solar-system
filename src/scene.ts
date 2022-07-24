import { Engine, EngineOptions, Scene, GlowLayer, MeshBuilder, GPUParticleSystem, ArcRotateCamera, PointLight, Vector3, Color3, StandardMaterial, Texture, HemisphericLight, PointerEventTypes } from '@babylonjs/core';
import '@babylonjs/inspector';
import { log } from './log';
import { bodies } from '../assets/solar-system.json';

let engine: Engine;
let scene: Scene;
let camera: ArcRotateCamera;

function pointerDown() {
  const pickInfo = scene.pick(scene.pointerX, scene.pointerY, undefined, false, scene.activeCamera);
  if (pickInfo?.pickedMesh) {
    log(pickInfo?.pickedMesh.name);
    camera.setTarget(pickInfo?.pickedMesh);
  }
}

export function createScene() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const options: EngineOptions = { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false, doNotHandleContextLost: true, audioEngine: false };
  engine = new Engine(canvas, true, options);
  engine.enableOfflineSupport = false;
  log(`engine: babylonjs ${Engine.Version}`);

  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  log(`renderer: ${engine._glRenderer.toLowerCase()}`);
  log('gpu acceleration:', GPUParticleSystem.IsSupported);

  scene = new Scene(engine);
  scene.clearCachedVertexData();
  scene.defaultCursor = 'crosshair';
  scene.fogEnabled = false;
  scene.spritesEnabled = false;
  scene.particlesEnabled = false;
  scene.physicsEnabled = false;
  scene.audioEnabled = false;
  scene.probesEnabled = false;
  engine.runRenderLoop(() => scene.render());

  // glow layer
  const glow = new GlowLayer('glow', scene);
  glow.intensity = 2;
  glow.blurKernelSize = 64;

  // const camera = new ArcRotateCamera('camera', Math.PI, 90 / 180 * Math.PI, 20, new Vector3(0, 0, 0), scene);
  camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 20, new Vector3(0, 0, 0), scene);
  // camera.parent = space;
  camera.fov = 0.1;
  camera.attachControl(canvas);
  camera.upperRadiusLimit = 400;
  camera.lowerRadiusLimit = 0.001;
  camera.useBouncingBehavior = true;

  const sunlight = new PointLight('sunlight', new Vector3(0, 0, 0), scene);
  sunlight.intensity = 1.15;
  const light = new HemisphericLight('light', new Vector3(0, 0, 0), scene);
  light.intensity = 0.2;

  // Create SkyBox
  const skybox = MeshBuilder.CreateBox('skybox', { size: 1000.0 }, scene);
  const skyboxMaterial = new StandardMaterial('skybox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.emissiveColor = new Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
  skybox.isPickable = false;

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN: pointerDown(); break;
      case PointerEventTypes.POINTERDOUBLETAP: break;
      case PointerEventTypes.POINTERUP: break;
      case PointerEventTypes.POINTERMOVE: break;
      case PointerEventTypes.POINTERWHEEL: break;
      default: break;
    }
  });

  // Show Inspector
  const globalRoot = document.getElementById('inspector') as HTMLDivElement;
  scene.debugLayer.show({ embedMode: true, overlay: false, showExplorer: true, showInspector: true, globalRoot });
}

export function createSolarSystem(data) {
  for (const name of Object.keys(data)) {
    const desc = bodies.find((b) => b.englishName === name);
    log('create', { name, data: data[name], desc });
    if (!desc) return;
    const diameterX = (desc.equaRadius ** 0.2) / 50;
    const diameterY = desc.polarRadius !== 0 ? (desc.polarRadius ** 0.2) / 50 : diameterX;
    const diameterZ = (desc.equaRadius ** 0.2) / 50;
    const sphere = MeshBuilder.CreateSphere(name, { diameterX, diameterY, diameterZ, segments: 20 }, scene);
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = new Color3(1, 1, 1);
    material.specularColor = new Color3(0, 0, 0);
    // material.emissiveColor = new Color3(0.05, 0.05, 0.05);
    if (name === 'Sun') {
      material.emissiveColor = new Color3(1, 0.9, 0.5);
    } else {
      material.diffuseTexture = new Texture(`../assets/${name.toLowerCase()}.jpg`, scene);
      material.diffuseTexture.level = 2;
    }
    // @ts-ignore
    if (material.diffuseTexture) material.diffuseTexture.uScale = -1;
    // @ts-ignore
    if (material.diffuseTexture) material.diffuseTexture.vScale = -1;
    sphere.material = material;
    sphere.position = new Vector3(...data[name]);
  }
}

export function updateSolarSystem(data) {
  for (const mesh of scene.meshes) {
    for (const name of Object.keys(data)) {
      if (mesh.name === name) {
        mesh.position = new Vector3(...data[name]);
      }
    }
  }
}
