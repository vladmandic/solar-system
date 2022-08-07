import * as SunCalc from 'suncalc';
import { vsop } from '../assets/vsop';

export function getAstronomyData(ts, lat, lon) {
  const sunTimes = SunCalc.getTimes(ts, lat, lon);
  const moonTimes = SunCalc.getMoonTimes(ts, lat, lon);
  const moonIllumination = SunCalc.getMoonIllumination(ts);
  const sunPos = SunCalc.getPosition(ts, lat, lon);
  const moonPos = SunCalc.getMoonPosition(ts, lat, lon);
  /*
    if (moonIllumination.phase <= 0.88) img = '../assets/phases/moon-87.webp';
    if (moonIllumination.phase <= 0.76) img = '../assets/phases/moon-62.webp';
    if (moonIllumination.phase <= 0.54) img = '../assets/phases/moon-50.webp';
    if (moonIllumination.phase <= 0.44) img = '../assets/phases/moon-37.webp';
    if (moonIllumination.phase <= 0.32) img = '../assets/phases/moon-25.webp';
    if (moonIllumination.phase <= 0.20) img = '../assets/phases/moon-12.webp';
    if (moonIllumination.phase <= 0.08) img = '../assets/phases/moon-0.webp';
  */
  const astronomy = { sunTimes, moonTimes, moonIllumination, sunPos, moonPos };
  // log('getAstronomyData', { ts, lat, lon }, astronomy);
  return astronomy;
}

export function getVSOPdata(date: Date) {
  // const day = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  // const d = (day / 365.25) * 360.0 * Math.PI / 180;
  // const t = -7.655 * Math.sin(d) + 9.873 * Math.sin(2 * d + 3.588);
  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 365250.0;
  const earth = vsop.getEarth(t);
  const emb = vsop.getEmb(t);
  const data = {
    // Sun: vsop.getSun(t),
    Sun: [0, 0, 0],
    Earth: earth,
    Moon: vsop.getMoon(earth, emb),
    Mercury: vsop.getMercury(t),
    Venus: vsop.getVenus(t),
    Mars: vsop.getMars(t),
    Jupiter: vsop.getJupiter(t),
    Saturn: vsop.getSaturn(t),
    Uranus: vsop.getUranus(t),
    Neptune: vsop.getNeptune(t),
  };
  // log('getVSOPdata', data);
  return data;
}
