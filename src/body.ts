import { Vector3, Color3, Color4 } from '@babylonjs/core/Maths';
import { Mesh, MeshBuilder } from '@babylonjs/core/Meshes';
import { StandardMaterial, Texture } from '@babylonjs/core/Materials';
import { GPUParticleSystem, PointParticleEmitter, ParticleSystem } from '@babylonjs/core/Particles';
import type { Scene } from '@babylonjs/core/scene';

import { log } from './log';
import { global } from './globals';
import { bodies } from '../assets/solar-system.json';

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
const hsv2rgba = (h, s, v) => {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1), 1];
};

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
  trace.maxLifeTime = 5;
  trace.minEmitPower = 0;
  trace.maxEmitPower = 0;
  trace.color1 = new Color4(...hsv2rgba(Math.round(360 * Math.random()), 1, 0.5));
  trace.color2 = new Color4(...hsv2rgba(Math.round(360 * Math.random()), 1, 0.1));
  trace.colorDead = new Color4(0, 0, 0, 0);
  trace.particleEmitterType = new PointParticleEmitter();
  trace.emitter = (global.scene as Scene).meshes.find((m) => m.name === name);
  trace.start();
  return trace;
}

export function createSolarBody(name: string, position: [number, number, number]): Mesh {
  const desc: Record<string, unknown> = bodies.find((b) => b.englishName === name) || {};
  log('create', { name, position, desc });
  const diameterX = (desc.equaRadius as number ** 0.2) / 50;
  const diameterY = desc.polarRadius !== 0 ? (desc.polarRadius as number ** 0.2) / 50 : diameterX;
  const diameterZ = (desc.equaRadius as number ** 0.2) / 50;
  const sphere = MeshBuilder.CreateSphere(name, { diameterX, diameterY, diameterZ, segments: 20 }, global.scene);
  const material = new StandardMaterial(name, global.scene as Scene);
  material.diffuseColor = new Color3(1, 1, 1);
  material.specularColor = new Color3(0, 0, 0);
  material.backFaceCulling = false;
  if (name === 'Sun') {
    material.emissiveColor = new Color3(1, 0.9, 0.5);
  } else {
    material.diffuseTexture = new Texture(`../assets/${name.toLowerCase()}.jpg`, global.scene);
    material.diffuseTexture.level = 2;
  }
  if (material.diffuseTexture) material.diffuseTexture['uScale'] = -1;
  if (material.diffuseTexture) material.diffuseTexture['vScale'] = -1;
  sphere.material = material;
  sphere.position = new Vector3(...position);
  sphere.rotation = new Vector3(Math.PI / 4, 0, -(desc.axialTilt as number || 0) * Math.PI / 360);
  createParticleSystem(name);
  global[name] = sphere;
  return sphere;
}
