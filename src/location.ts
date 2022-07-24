import { log } from './log';
import * as secrets from '../secrets.json';

export type Location = { lat: number, lon: number, accuracy: number }

export async function getIPLocation(): Promise<Location> {
  let res = await fetch('https://api.ipify.org?format=json');
  const json = await res.json();
  const ip = json.ip;
  res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${secrets.google}`, {
    method: 'POST',
    body: JSON.stringify({ considerIp: true }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  const rec = { ip, accuracy: data.accuracy, lat: data.location.lat, lon: data.location.lng, name: '' };
  log('getIPLocation', rec);
  return rec;
}
