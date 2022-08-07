import { log } from './log';
import * as secrets from '../secrets.json';

export type Location = { ip: string, degrees: [number, number], radians: [number, number], accuracy: number, position: [number, number, number] }

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
  const latR = data.location.lat * Math.PI / 180;
  const lonR = data.location.lng * Math.PI / 180;
  const x = Math.sin(Math.PI / 2 - latR) * Math.cos(lonR);
  const y = Math.sin(Math.PI / 2 - latR) * Math.sin(lonR);
  const z = Math.cos(Math.PI / 2 - latR);
  const rec: Location = { ip, accuracy: data.accuracy, degrees: [data.location.lat, data.location.lng], radians: [latR, lonR], position: [x, y, z] };
  log('getIPLocation', rec);
  return rec;
}
