import { useEffect, useState } from 'react';

/**
 * useDeferredMount
 * Returns true only after first user interaction (mousemove, keydown, touchstart) or after a timeout fallback.
 */
export function useDeferredMount(timeout = 2500) {
  const [ready, setReady] = useState(false);
  useEffect(()=>{
    let fired = false; const fire = () => { if(!fired){ fired=true; setReady(true); cleanup(); } };
    const events = ['mousemove','keydown','touchstart','pointerdown'];
    const cleanup = () => events.forEach(ev => window.removeEventListener(ev, fire));
    events.forEach(ev => window.addEventListener(ev, fire, { passive: true }));
    const t = setTimeout(()=> fire(), timeout);
    return ()=> { clearTimeout(t); cleanup(); };
  },[timeout]);
  return ready;
}
