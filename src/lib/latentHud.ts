"use client";
import { useSyncExternalStore } from "react";

/**
 * Tiny store the 3D scene writes to and the hero's readout subscribes to.
 * Lives outside the scene module so the hero can read it without loading three.js.
 */
export type HudState = { cluster: string; score: number; active: number };

let state: HudState = { cluster: "", score: 0, active: -1 };
const listeners = new Set<() => void>();

let lastEmit = 0;

/** Called every frame by the scene; emits on cluster change or at most ~8×/s for score changes. */
export function setHud(next: HudState) {
  const now = performance.now();
  if (next.active === state.active && (Math.abs(next.score - state.score) < 0.01 || now - lastEmit < 120)) return;
  lastEmit = now;
  state = next;
  listeners.forEach((l) => l());
}

export function useHud() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}
