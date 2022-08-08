import { Vector3 } from '@babylonjs/core/Maths';
import type { Mesh } from '@babylonjs/core/Meshes';
import type { ArcRotateCamera } from '@babylonjs/core/Cameras';
import { global } from './globals';
import { getAstronomyData, getVSOPdata } from './astronomy';
import { createScene } from './scene';
import { createSolarBody } from './body';
import { bodies } from '../assets/solar-system.json';

const getDate = () => {
  const current = global.date;
  const date = global.pause ? current : new Date((global.date.getTime() + (3600000 * global.step)));
  global.date = date;
  return date;
};

export async function renderSolarSystem(date?: Date) {
  if (!global.scene) global.scene = createScene();

  // set camera depending on selected scene
  const camera = global.scene.activeCamera as ArcRotateCamera;
  if (global.system === 'sun') {
    if (camera.parent) {
      camera.parent = null;
      camera.position = new Vector3(0, 0, 30);
    }
  } else if (global.system === 'earth') {
    if (!camera.parent) {
      camera.parent = global.scene.getNodeByName('Earth') as Mesh;
    }
  }

  // get solar system position data
  date = date || getDate();
  const data = getVSOPdata(date);

  const suncalc = getAstronomyData(date, global.location.degrees[0], global.location.degrees[1]);
  if (global.menu) global.menu.updateInputDateTime('timestamp', date);
  const div = document.getElementById('suncalc') as HTMLDivElement;
  div.style.display = global.suncalc ? 'block' : 'none';
  if (global.suncalc) div.innerText = JSON.stringify(suncalc, null, 2).replace(/{|}|"|,/g, '').replace('  ', ' ');

  // loop through all bodies
  for (const name of Object.keys(data)) {
    let mesh = global.scene.meshes.find((m) => m.name === name) as Mesh;
    if (!mesh) mesh = createSolarBody(name, data[name]);
    switch (mesh.name) {
      case 'Sun':
        break; // no-op
      case 'Moon': // calculate relative moon position so we can expand its orbit
        const abs = data['Earth'];
        const rel = [data['Earth'][0] - data['Moon'][0], data['Earth'][1] - data['Moon'][1], data['Earth'][2] - data['Moon'][2]];
        mesh.position = new Vector3(
          (abs[0] ** global.planetOrbitExponent * global.planetOrbitExpand) + (rel[0] ** global.planetOrbitExponent * global.moonOrbitExpand),
          (abs[1] ** global.planetOrbitExponent * global.planetOrbitExpand) + (rel[1] ** global.planetOrbitExponent * global.moonOrbitExpand),
          (abs[2] ** global.planetOrbitExponent * global.planetOrbitExpand) + (rel[2] ** global.planetOrbitExponent * global.moonOrbitExpand),
        );
        break;
      default: // scale planet orbit distances
        mesh.position = new Vector3(
          data[name][0] ** global.planetOrbitExponent * global.planetOrbitExpand,
          data[name][1] ** global.planetOrbitExponent * global.planetOrbitExpand,
          data[name][2] ** global.planetOrbitExponent * global.planetOrbitExpand,
        );
        break;
    }
    const desc: Record<string, unknown> = bodies.find((b) => b.englishName === name) || {}; // find description annotation for a body
    if (desc.sideralRotation as number > 0) mesh.rotation.x = (2 * (date.getTime() / 3600000) / (desc.sideralRotation as number) * Math.PI) % (2 * Math.PI); // set sideral rotation for a body
  }
}
