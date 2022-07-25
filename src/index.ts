import { log } from './log';
import { getVSOPdata } from './astronomy';
import { updateSolarSystem } from './scene';

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
    date = new Date((date.getTime() + (3600000 * 2))); // 2h intervals
    const data = getVSOPdata(date);
    updateSolarSystem(data);
  }, 5);
}

window.onload = main;
