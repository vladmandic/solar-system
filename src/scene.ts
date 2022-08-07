import { Scene } from '@babylonjs/core/scene';
import { Engine, EngineOptions } from '@babylonjs/core/Engines';
import { Vector3, Color3 } from '@babylonjs/core/Maths';
import { ArcRotateCamera } from '@babylonjs/core/Cameras';
import { PointLight, HemisphericLight } from '@babylonjs/core/Lights';
import { GlowLayer } from '@babylonjs/core/Layers';
import { MeshBuilder } from '@babylonjs/core/Meshes';
import { GPUParticleSystem } from '@babylonjs/core/Particles';
import { StandardMaterial } from '@babylonjs/core/Materials';
import '@babylonjs/inspector';
import { log } from './log';
import { global } from './globals';
import { registerEvents } from './events';

export function createScene() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!global.engine) {
    const options: EngineOptions = { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false, doNotHandleContextLost: true, audioEngine: false };
    global.engine = new Engine(canvas, true, options);
    global.engine.enableOfflineSupport = false;
    log(`engine: babylonjs ${Engine.Version}`);
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    log(`renderer: ${global.engine._glRenderer.toLowerCase()}`);
    log('gpu acceleration:', GPUParticleSystem.IsSupported);
  }
  if (global.scene) {
    for (const node of global.scene.getNodes()) node.dispose();
    global.scene.dispose();
  }

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

  const camera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 10, new Vector3(0, 0, 0), global.scene);
  camera.fov = 0.1;
  camera.attachControl(canvas);
  camera.upperRadiusLimit = 400;
  camera.lowerRadiusLimit = 0.001;
  camera.wheelDeltaPercentage = 0.01;
  camera.useBouncingBehavior = true;
  camera.radius = 30;

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

  registerEvents();
  return global.scene;
}
