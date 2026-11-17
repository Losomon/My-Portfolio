// Particle Field settings + presets.
// `ParticleFieldSettings` is exactly the object the engine (engine.ts) takes.
// The two galaxy presets below differ only by seed; both are "galaxy", 250k particles.

export interface ParticleFieldSettings {
  count: number;
  size: number;
  speed: number;
  opacity: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  colorA: string;
  colorB: string;
  autorotate: boolean;
}

export interface ParticleFormField {
  kind: string;
  seed: number;
}

const BASE_SETTINGS: ParticleFieldSettings = {
  count: 36000,
  size: 1.8,
  speed: 0.4,
  opacity: 0.65,
  bloomStrength: 0.65,
  bloomRadius: 0.08,
  bloomThreshold: 0.21,
  colorA: "#25b8ff",
  colorB: "#b04dff",
  autorotate: false,
};

// Galaxy A — seed 1641101573
export const GALAXY_A_SETTINGS: ParticleFieldSettings = { ...BASE_SETTINGS };
export const GALAXY_A_FORM: ParticleFormField = { kind: "galaxy", seed: 1641101573 };

// Galaxy B — seed 1310099124
export const GALAXY_B_SETTINGS: ParticleFieldSettings = { ...BASE_SETTINGS };
export const GALAXY_B_FORM: ParticleFormField = { kind: "galaxy", seed: 1310099124 };

// Galaxy A — light variant for the projects section. Fewer particles, softer
// bloom, lower opacity and slower motion so the showcase stays calm and
// mobile-friendly (see `ParticleField`'s `light` prop for mobile reduction).
export const GALAXY_A_LIGHT_SETTINGS: ParticleFieldSettings = {
  ...BASE_SETTINGS,
  count: 18000,
  size: 1.6,
  speed: 0.28,
  opacity: 0.45,
  bloomStrength: 0.4,
  bloomRadius: 0.1,
  bloomThreshold: 0.3,
};
export const GALAXY_A_LIGHT_FORM: ParticleFormField = { kind: "galaxy", seed: 1641101573 };