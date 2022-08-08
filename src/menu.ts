import type { ArcRotateCamera } from '@babylonjs/core/Cameras';
import { log } from './log';
import { global } from './globals';
import { createScene } from './scene';
import { Menu } from './Menu.js';
import { renderSolarSystem } from './render';

export async function createMenu() {
  log('createMenu', global);

  if (!global.menu) global.menu = new Menu(document.body, 'solar system simulation', { top: '20px', right: '20px' });

  global.menu.addBool('pause', global, 'pause');
  global.menu.addBool('celestial body data', global, 'tooltip');
  global.menu.addBool('sun & moon details', global, 'suncalc');
  global.menu.addButton('show inspector', 'hide inspector', () => {
    if (!global.scene) return;
    const globalRoot = document.getElementById('inspector') as HTMLDivElement;
    if (global.scene.debugLayer.isVisible()) global.scene.debugLayer.hide();
    else global.scene.debugLayer.show({ embedMode: true, overlay: false, showExplorer: true, showInspector: true, globalRoot });
  });
  global.menu.addButton('reset scene', 'reset scene', () => createScene());
  global.menu.addList('simulation centric view', ['sun', 'earth'], 'sun', (item) => {
    global.system = item;
    if (!global.scene) return;
    if (item === 'sun') {
      (global.scene.activeCamera as ArcRotateCamera).alpha = Math.PI / 2;
      (global.scene.activeCamera as ArcRotateCamera).beta = Math.PI / 2;
    }
    if (item === 'earth') {
      (global.scene.activeCamera as ArcRotateCamera).alpha = 0;
      (global.scene.activeCamera as ArcRotateCamera).beta = -3 * Math.PI / 4;
    }
  });
  global.menu.addRange('time step', global, 'step', 0, 24, 0.01);
  global.menu.addRange('planet orbit expansion factor', global, 'planetOrbitExpand', 0.1, 10, 0.1);
  global.menu.addRange('planet orbit expansion exponent', global, 'planetOrbitExponent', 0.1, 10, 0.1);
  global.menu.addRange('moon orbit expansion factor', global, 'moonOrbitExpand', 1, 100, 1);
  global.menu.addRange('body size exponent', global, 'sizeExponent', 0.05, 1, 0.01);
  global.menu.addRange('body size factor', global, 'sizeFactor', 0.001, 1, 0.001);
  global.menu.addInputDateTime('timestamp', global, 'date', renderSolarSystem);
}
