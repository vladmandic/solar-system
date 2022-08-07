import { Vector3 } from '@babylonjs/core/Maths';
import type { Mesh } from '@babylonjs/core/Meshes';
import type { ArcRotateCamera } from '@babylonjs/core/Cameras';
import { log } from './log';
import { global } from './globals';
import { getVSOPdata } from './astronomy';
import { createMenu } from './menu';
import { getIPLocation } from './location';
import { createScene } from './scene';
import { createSolarBody } from './body';
import { bodies } from '../assets/solar-system.json';

const getDate = () => {
  const current = new Date(global.date);
  const date = global.pause ? current : new Date((current.getTime() + (3600000 * global.step)));
  global.date = date.toISOString();
  return date;
};

async function renderSolarSystem(date?: Date) {
  if (!global.scene) global.scene = createScene();

  // set camera depending on selected scene
  const camera = global.scene.activeCamera as ArcRotateCamera;
  if (global.system?.['value'] === 'solar') {
    if (camera.parent) {
      camera.parent = null;
      camera.position = new Vector3(0, 0, 30);
    }
  } else if (global.system?.['value'] === 'earth') {
    if (!camera.parent) {
      camera.parent = global.scene.getNodeByName('Earth') as Mesh;
    }
  }

  // get solar system position data
  date = date || getDate();
  const data = getVSOPdata(date);

  // loop through all bodies
  for (const name of Object.keys(data)) {
    let mesh = global.scene.meshes.find((m) => m.name === name) as Mesh;
    if (!mesh) mesh = createSolarBody(name, data[name]);
    mesh.position = new Vector3(...data[name]); // set position for a body
    if (mesh.name === 'Moon') mesh.locallyTranslate(new Vector3(0.075, 0.075, 0.075)); // artificially increase moon distance
    const desc: Record<string, unknown> = bodies.find((b) => b.englishName === name) || {}; // find description annotation for a body
    if (desc.sideralRotation as number > 0) mesh.rotation.y = 2 * (date.getTime() / 3600000) / (desc.sideralRotation as number) * Math.PI; // set sideral rotation for a body
  }
}

async function render() {
  if (!global.pause) await renderSolarSystem();
  requestAnimationFrame(render);
}

async function main() {
  log('solar system model app');
  createMenu();
  global.location = await getIPLocation();
  await renderSolarSystem(); // initial render
  render(); // start render loop
}

window.onload = main;
