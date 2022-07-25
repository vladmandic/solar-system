import { Engine, EngineOptions, Scene, GlowLayer, MeshBuilder, GPUParticleSystem, ArcRotateCamera, PointLight, Vector3, Color3, StandardMaterial, HemisphericLight } from '@babylonjs/core';
import '@babylonjs/inspector';
import { log } from './log';
import { global } from './globals';
import { registerEvents } from './events';

export function createScene() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const options: EngineOptions = { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false, doNotHandleContextLost: true, audioEngine: false };
  global.engine = new Engine(canvas, true, options);
  global.engine.enableOfflineSupport = false;
  log(`engine: babylonjs ${Engine.Version}`);

  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  log(`renderer: ${global.engine._glRenderer.toLowerCase()}`);
  log('gpu acceleration:', GPUParticleSystem.IsSupported);

  global.scene = new Scene(global.engine);
  global.scene.clearCachedVertexData();
  global.scene.defaultCursor = 'crosshair';
  global.scene.fogEnabled = false;
  global.scene.spritesEnabled = false;
  global.scene.particlesEnabled = true;
  global.scene.physicsEnabled = false;
  global.scene.audioEnabled = false;
  global.scene.probesEnabled = false;
  global.engine.runRenderLoop(() => (global.scene as Scene).render());

  // glow layer
  const glow = new GlowLayer('Glow', global.scene);
  glow.intensity = 2;
  glow.blurKernelSize = 64;

  // const camera = new ArcRotateCamera('camera', Math.PI, 90 / 180 * Math.PI, 20, new Vector3(0, 0, 0), scene);
  const camera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 20, new Vector3(0, 0, 0), global.scene);
  // camera.parent = space;
  camera.fov = 0.1;
  camera.attachControl(canvas);
  camera.upperRadiusLimit = 400;
  camera.lowerRadiusLimit = 0.001;
  camera.useBouncingBehavior = true;

  const sunlight = new PointLight('Sunlight', new Vector3(0, 0, 0), global.scene);
  sunlight.intensity = 1.15;
  const light = new HemisphericLight('Global Light', new Vector3(0, 0, 0), global.scene);
  light.intensity = 0.2;

  // Create SkyBox
  const skybox = MeshBuilder.CreateBox('SkyBox', { size: 1000.0 }, global.scene);
  const skyboxMaterial = new StandardMaterial('SkyBox', global.scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.emissiveColor = new Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
  skybox.isPickable = false;

  // Show Inspector
  const globalRoot = document.getElementById('inspector') as HTMLDivElement;
  global.scene.debugLayer.show({ embedMode: true, overlay: false, showExplorer: true, showInspector: true, globalRoot });

  registerEvents();
  return global.scene;
}
