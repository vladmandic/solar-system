import { log } from './log';
import { global } from './globals';
import { createMenu } from './menu';
import { getIPLocation } from './location';
import { renderSolarSystem } from './render';

async function runRenderLoop() {
  if (!global.pause) await renderSolarSystem();
  requestAnimationFrame(runRenderLoop);
}

async function main() {
  log('solar system model app');
  createMenu();
  global.location = await getIPLocation();
  await renderSolarSystem(); // initial render
  runRenderLoop(); // start render loop
}

window.onload = main;
