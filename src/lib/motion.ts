"use client";
import { useSyncExternalStore } from "react";

/* ── Intro hand-off ──────────────────────────────────────────────────────────
 * The preloader flips this once it starts leaving; the hero and navbar wait
 * for it so their entrance plays as the curtain lifts, not hidden behind it.
 */
let introDone = false;
const introListeners = new Set<() => void>();

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  introListeners.forEach((l) => l());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => { introListeners.add(cb); return () => introListeners.delete(cb); },
    () => introDone,
    () => false,
  );
}

/* ── Lite mode ───────────────────────────────────────────────────────────────
 * True when the visitor prefers reduced motion, or the device looks low-powered
 * (few CPU cores / little memory). Heavy effects scale down or switch off.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";

function lowPowerDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
}

export function useReducedMotionPref() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(REDUCED); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export function useLiteMode() {
  const reduced = useReducedMotionPref();
  const lowPower = useSyncExternalStore(() => () => {}, lowPowerDevice, () => false);
  return { reduced, lowPower, lite: reduced || lowPower };
}
