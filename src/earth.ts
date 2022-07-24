import { log } from './log';
import { getIPLocation } from './location';
import { getVSOPdata } from './astronomy';
import { createScene, createSolarSystem, updateSolarSystem } from './scene';

async function main() {
  log('earth app');
  const loc = await getIPLocation();
  log('location', loc);
  // const data = await getAstronomyData(Date.now(), loc.lat, loc.lon);
  // log('astronomy', data);
  let date = new Date();
  createScene();
  const data = getVSOPdata(date);
  createSolarSystem(data);

  setInterval(() => {
    date = new Date((date.getTime() + (3600000 * 2)));
    const d = getVSOPdata(date);
    updateSolarSystem(d);
  }, 5);
  // rotateEarth(loc.lat, loc.lon);
}

window.onload = main;
