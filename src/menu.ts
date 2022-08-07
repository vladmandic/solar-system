import type { ArcRotateCamera } from '@babylonjs/core/Cameras';
import { Vector3 } from '@babylonjs/core/Maths';
import { Pane } from 'tweakpane/dist/tweakpane';
import { log } from './log';
import { global } from './globals';

export async function createMenu() {
  log('createMenu', global);
  const pane = new Pane();
  const div = document.querySelector('.tp-rotv') as HTMLDivElement;
  div.style.fontSize = '1rem';
  div.style.fontFamily = 'CenturyGothic';
  div.style.borderRadius = '0';

  pane.addMonitor(global, 'date');
  pane.addInput(global, 'date');
  pane.addInput(global, 'step', { min: 0, max: 24, step: 0.1 });
  pane.addInput(global, 'pause');
  pane.addInput(global, 'tooltip');

  global.system = pane.addBlade({
    view: 'list',
    label: 'scene',
    options: [{ text: 'solar system', value: 'solar' }, { text: 'earth centric', value: 'earth' }],
    value: 'solar',
  });

  const btnInspector = pane.addButton({ title: '', label: 'inspector' });
  btnInspector.on('click', () => {
    if (!global.scene) return;
    const globalRoot = document.getElementById('inspector') as HTMLDivElement;
    if (global.scene.debugLayer.isVisible()) global.scene.debugLayer.hide();
    else global.scene.debugLayer.show({ embedMode: true, overlay: false, showExplorer: true, showInspector: true, globalRoot });
  });

  const btnResetCamera = pane.addButton({ title: '', label: 'camera' });
  btnResetCamera.on('click', async () => {
    if (!global.scene) return;
    const camera = (global.scene.activeCamera as ArcRotateCamera);
    camera.setTarget(new Vector3(0, 0, 0));
    camera.alpha = Math.PI / 2;
    camera.beta = 3 * Math.PI / 4;
    camera.radius = 30;
    camera.parent = null;
    camera.position = new Vector3(0, 0, 30);
  });
}
