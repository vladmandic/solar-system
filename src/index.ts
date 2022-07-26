import { Vector3 } from '@babylonjs/core';
import { log } from './log';
import { global } from './globals';
import { getVSOPdata } from './astronomy';
import { createScene } from './scene';
import { createSolarBody } from './body';
import { createMenu } from './menu';
import { bodies } from '../assets/solar-system.json';

async function render() {
  if (!global.pause) {
    const current = new Date(global.date);
    const date = new Date((current.getTime() + (3600000 * global.step)));
    global.date = date.toISOString();
    if (!global.scene) global.scene = createScene();
    const data = getVSOPdata(date);
    for (const name of Object.keys(data)) {
      let mesh = global.scene.meshes.find((m) => m.name === name);
      if (!mesh) mesh = createSolarBody(name, data[name]);
      mesh.position = new Vector3(...data[name]);

      const desc: Record<string, unknown> = bodies.find((b) => b.englishName === name) || {};
      if (desc.sideralRotation as number > 0) mesh.rotation.y = 2 * (date.getTime() / 3600000) / (desc.sideralRotation as number) * Math.PI;
    }
  }
  requestAnimationFrame(render);
}

async function main() {
  log('solar system model app');
  createMenu();
  /*
  const loc = await getIPLocation();
  log('location', loc);
  const astronomy = await getAstronomyData(Date.now(), loc.lat, loc.lon);
  log('astronomy', astronomy);
  */
  render();
}

window.onload = main;
