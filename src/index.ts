import { Vector3 } from '@babylonjs/core';
import { log } from './log';
import { global } from './globals';
import { getVSOPdata } from './astronomy';
import { createScene } from './scene';
import { createSolarBody } from './body';

async function main() {
  log('solar system model app');
  /*
  const loc = await getIPLocation();
  log('location', loc);
  const astronomy = await getAstronomyData(Date.now(), loc.lat, loc.lon);
  log('astronomy', astronomy);
  */

  let date = new Date();
  setInterval(() => {
    if (global.pause) return;
    date = new Date((date.getTime() + (3600000 * global.step)));
    if (!global.scene) global.scene = createScene();
    const data = getVSOPdata(date);
    for (const name of Object.keys(data)) {
      let mesh = global.scene.meshes.find((m) => m.name === name);
      if (!mesh) mesh = createSolarBody(name, data[name]);
      mesh.position = new Vector3(...data[name]);
    }
  }, 5);
}

window.onload = main;
