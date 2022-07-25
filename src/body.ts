import { Scene, MeshBuilder, GPUParticleSystem, Vector3, Color3, StandardMaterial, Texture, Mesh, PointParticleEmitter, ParticleSystem, Color4 } from '@babylonjs/core';
import { log } from './log';
import { global } from './globals';
import { bodies } from '../assets/solar-system.json';

function createParticleSystem(name: string): ParticleSystem | GPUParticleSystem {
  const capacity = 10000;
  let trace;
  if (GPUParticleSystem.IsSupported) {
    trace = new GPUParticleSystem(name, { capacity }, global.scene as Scene);
  } else {
    trace = new ParticleSystem(name, capacity, global.scene as Scene);
  }
  trace.particleTexture = new Texture('./assets/flare.png');
  trace.emitRate = 300;
  trace.minEmitBox = new Vector3(-0.02, -0.02, -0.02);
  trace.maxEmitBox = new Vector3(+0.02, +0.02, +0.02);
  trace.minSize = 0.01;
  trace.maxSize = 0.02;
  trace.minLifeTime = 1;
  trace.maxLifeTime = 10;
  trace.minEmitPower = 0;
  trace.maxEmitPower = 0;
  trace.color1 = Color4.FromHexString('#292900');
  trace.color2 = Color4.FromHexString('#002929');
  trace.colorDead = Color4.FromHexString('#290000');
  trace.particleEmitterType = new PointParticleEmitter();
  trace.emitter = (global.scene as Scene).meshes.find((m) => m.name === name);
  trace.start();
  return trace;
}

export function createSolarBody(name: string, data): Mesh {
  const desc: Record<string, unknown> = bodies.find((b) => b.englishName === name) || {};
  log('create', { name, data, desc });
  const diameterX = (desc.equaRadius as number ** 0.2) / 50;
  const diameterY = desc.polarRadius !== 0 ? (desc.polarRadius as number ** 0.2) / 50 : diameterX;
  const diameterZ = (desc.equaRadius as number ** 0.2) / 50;
  const sphere = MeshBuilder.CreateSphere(name, { diameterX, diameterY, diameterZ, segments: 20 }, global.scene);
  const material = new StandardMaterial(name, global.scene as Scene);
  material.diffuseColor = new Color3(1, 1, 1);
  material.specularColor = new Color3(0, 0, 0);
  // material.emissiveColor = new Color3(0.05, 0.05, 0.05);
  if (name === 'Sun') {
    material.emissiveColor = new Color3(1, 0.9, 0.5);
  } else {
    material.diffuseTexture = new Texture(`../assets/${name.toLowerCase()}.jpg`, global.scene);
    material.diffuseTexture.level = 2;
  }
  if (material.diffuseTexture) material.diffuseTexture['uScale'] = -1;
  if (material.diffuseTexture) material.diffuseTexture['vScale'] = -1;
  sphere.material = material;
  sphere.position = new Vector3(...data);
  createParticleSystem(name);
  return sphere;
}
