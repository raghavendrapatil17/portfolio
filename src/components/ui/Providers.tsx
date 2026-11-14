"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MotionConfig } from "framer-motion";

/**
 * reducedMotion="user": visitors with "reduce motion" enabled get opacity-only
 * transitions — every transform/slide animation is skipped automatically.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const subscribe = () => () => {};

/** Renders overlays at <body> so transformed ancestors can't break position: fixed. */
export function BodyPortal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted ? createPortal(children, document.body) : null;
}
