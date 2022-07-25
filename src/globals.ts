import type { Scene, Engine } from '@babylonjs/core';

type Global = {
  engine: Engine | null,
  scene: Scene | null,
  pause: boolean,
  step: number,
};

export const global: Global = {
  engine: null,
  scene: null,
  pause: false,
  step: 2,
};
