import { ArcRotateCamera, Vector3 } from '@babylonjs/core';
import { Pane } from 'tweakpane';
import { log } from './log';
import { global } from './globals';

export async function createMenu() {
  log('createMenu', global);
  const pane = new Pane();
  pane.addMonitor(global, 'date');
  pane.addInput(global, 'date');
  pane.addInput(global, 'step', { min: 0, max: 24, step: 0.1 });
  pane.addInput(global, 'pause');
  pane.addInput(global, 'tooltip');
  const btnResetAngle = pane.addButton({ title: '', label: 'reset camera' });
  btnResetAngle.on('click', () => {
    if (!global.scene) return;
    const camera = (global.scene.activeCamera as ArcRotateCamera);
    camera.setTarget(new Vector3(0, 0, 0));
    camera.alpha = Math.PI / 2;
    camera.beta = Math.PI / 2;
    camera.radius = 20;
  });
  const btnInspector = pane.addButton({ title: '', label: 'show inspector' });
  btnInspector.on('click', () => {
    if (!global.scene) return;
    const globalRoot = document.getElementById('inspector') as HTMLDivElement;
    if (global.scene.debugLayer.isVisible()) global.scene.debugLayer.hide();
    else global.scene.debugLayer.show({ embedMode: true, overlay: false, showExplorer: true, showInspector: true, globalRoot });
  });
  const div = document.querySelector('.tp-rotv') as HTMLDivElement;
  div.style.fontSize = '1rem';
  div.style.fontFamily = 'CenturyGothic';
  div.style.borderRadius = '0';
}
