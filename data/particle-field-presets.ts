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
  count: 250000,
  size: 1.95,
  speed: 0.45,
  opacity: 0.7,
  bloomStrength: 0.75,
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