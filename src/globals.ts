import type { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines';
import type { Location } from './location';
import type { Menu } from './Menu.js';

type Global = {
  engine: Engine | null,
  scene: Scene | null,
  system: unknown,
  pause: boolean,
  tooltip: boolean,
  suncalc: boolean,
  step: number,
  date: Date,
  location: Location,
  moonOrbitExpand: number,
  planetOrbitExpand: number,
  planetOrbitExponent: number,
  sizeExponent: number,
  sizeFactor: number,
  menu: null | Menu,
};

export const global: Global = {
  engine: null,
  scene: null,
  pause: false,
  step: 0.02,
  tooltip: false,
  suncalc: false,
  system: null,
  date: new Date(),
  location: { ip: '', accuracy: 0, degrees: [0, 0], radians: [0, 0], position: [0, 0, 0] },
  planetOrbitExpand: 1.0,
  planetOrbitExponent: 1.0,
  moonOrbitExpand: 50.0,
  sizeExponent: 0.2,
  sizeFactor: 0.02,
  menu: null,
};

// @ts-ignore
window.global = global;
