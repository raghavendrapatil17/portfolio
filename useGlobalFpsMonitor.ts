import { useEffect } from 'react';

/**
 * Global FPS monitor.
 * Logs a warning when rolling average FPS dips below thresholdX times consecutively.
 */
export function useGlobalFpsMonitor(threshold = 30, windowSize = 40, consecutive = 3) {
  useEffect(()=>{
    let last = performance.now();
    const samples:number[] = [];
    let lowStreak = 0;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = now - last; last = now;
      const fps = 1000/dt;
      samples.push(fps); if(samples.length > windowSize) samples.shift();
      const avg = samples.reduce((p,c)=>p+c,0)/samples.length;
      if (samples.length === windowSize) {
        if (avg < threshold) {
          lowStreak++;
          if (lowStreak >= consecutive) {
            console.warn(`[Perf] Average FPS ${avg.toFixed(1)} below ${threshold} for ${lowStreak} consecutive windows.`);
            lowStreak = 0; // reset after reporting
          }
        } else lowStreak = 0;
      }
    };
    frame = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(frame);
  }, [threshold, windowSize, consecutive]);
}
