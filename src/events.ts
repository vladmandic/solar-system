import { ArcRotateCamera, PointerEventTypes, Vector3 } from '@babylonjs/core';
import { log } from './log';
import { global } from './globals';
import { bodies } from '../assets/solar-system.json';

export function pointerDown() {
  if (!global.scene) return;
  const pickInfo = global.scene.pick(global.scene.pointerX, global.scene.pointerY, undefined, false, global.scene.activeCamera);
  log('pointerDown', pickInfo);
  if (pickInfo?.pickedMesh) {
    log(pickInfo?.pickedMesh.name);
    (global.scene.activeCamera as ArcRotateCamera).setTarget(pickInfo?.pickedMesh);
  } else {
    // global.pause = !global.pause;
  }
}

export function pointerDoubleTap() {
  if (!global.scene) return;
  log('pointerDoubleTap');
  (document.getElementById('desc') as HTMLDivElement).innerText = '';
  const camera = (global.scene.activeCamera as ArcRotateCamera);
  camera.setTarget(new Vector3(0, 0, 0));
}

let lastName = '';
export function pointerMove() {
  (document.getElementById('desc') as HTMLDivElement).style.display = global.tooltip ? 'block' : 'none';
  if (!global.scene) return;
  const pickInfo = global.scene.pick(global.scene.pointerX, global.scene.pointerY, undefined, false, global.scene.activeCamera);
  if (!pickInfo || !pickInfo.pickedMesh) return;
  const name = pickInfo.pickedMesh.name;
  if (lastName === name) return;
  const desc: Record<string, unknown> = bodies.find((b) => b.englishName === name) || {};
  log('pointerMove', name, desc);
  let str = '';
  for (const [key, val] of Object.entries(desc)) {
    if (key === 'id' || key === 'isPlanet' || key === 'name') continue;
    if (val === '' || `${val}`.startsWith('http') || val === null) continue;
    let v = val;
    if (Array.isArray(val)) v = val.length;
    if (typeof val === 'object') v = JSON.stringify(val, null, 2).replace(/{|}|"|,/g, '').replace('  ', ' ');
    str += `${key} ${v}<br>`;
  }
  (document.getElementById('desc') as HTMLDivElement).innerHTML = str;
  lastName = name;
}

export function registerEvents() {
  if (!global.scene) return;
  global.scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN: pointerDown(); break;
      case PointerEventTypes.POINTERDOUBLETAP: pointerDoubleTap(); break;
      case PointerEventTypes.POINTERUP: break;
      case PointerEventTypes.POINTERMOVE: pointerMove(); break;
      case PointerEventTypes.POINTERWHEEL: break;
      default: break;
    }
  });
}
