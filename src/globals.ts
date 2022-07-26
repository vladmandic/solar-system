import type { Scene, Engine } from '@babylonjs/core';

type Global = {
  engine: Engine | null,
  scene: Scene | null,
  pause: boolean,
  tooltip: boolean,
  step: number,
  date: string,
};

export const global: Global = {
  engine: null,
  scene: null,
  pause: false,
  step: 2,
  tooltip: true,
  date: new Date().toISOString(),
};

// @ts-ignore
window.global = global;
