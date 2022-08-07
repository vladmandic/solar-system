import type { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines';
import type { Location } from './location';

type Global = {
  engine: Engine | null,
  scene: Scene | null,
  system: unknown,
  pause: boolean,
  tooltip: boolean,
  step: number,
  date: string,
  location: Location,
};

export const global: Global = {
  engine: null,
  scene: null,
  pause: true,
  step: 0.01,
  tooltip: false,
  system: null,
  date: new Date().toISOString(),
  location: { ip: '', accuracy: 0, degrees: [0, 0], radians: [0, 0], position: [0, 0, 0] },
};

// @ts-ignore
window.global = global;
