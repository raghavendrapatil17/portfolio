import React, { useEffect, useRef, useState } from 'react';

/**
 * InteractiveBackground
 * Advanced canvas effect with:
 *  - Particle network (nodes + dynamic links)
 *  - Mouse gravity + parallax drift
 *  - Click burst particles
 *  - Ripple waves (click & idle)
 *  - Performance auto-throttle (FPS monitor)
 *  - Respect prefers-reduced-motion & user toggle (persisted)
 */

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; hue: number; life: number; maxLife: number;
}
interface Ripple { x: number; y: number; r: number; opacity: number; }

const MAX_PARTICLES = 90;
const MIN_PARTICLES = 45;
const STORAGE_KEY = 'fx-enabled';

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, active: false });
  const frameRef = useRef(0);
  const fpsRef = useRef(0);
  const lastFpsCheck = useRef(performance.now());
  const frames = useRef(0);
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '0') return false;
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });

  // Toggle persistence
  function toggleFx() {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle init
    function spawnParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1 + Math.random() * 2.2,
        hue: 180 + Math.random() * 180,
        life: 0,
        maxLife: 600 + Math.random() * 600
      };
    }
    if (particlesRef.current.length === 0) {
      const target = Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, Math.floor(width * height / 25000)));
      for (let i=0;i<target;i++) particlesRef.current.push(spawnParticle());
    }

    // Interaction handlers
    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left);
      mouseRef.current.y = (e.clientY - rect.top);
      mouseRef.current.active = true;
    }
    function onMouseLeave() { mouseRef.current.active = false; }
    function onClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      // Burst
      for (let i=0;i<16;i++) {
        particlesRef.current.push({
          x: cx,
          y: cy,
            vx: (Math.random()-0.5) * 3,
            vy: (Math.random()-0.5) * 3,
          size: 1 + Math.random()*2,
          hue: 30 + Math.random()*300,
          life: 0,
          maxLife: 240 + Math.random()*240
        });
      }
      if (particlesRef.current.length > MAX_PARTICLES) particlesRef.current.splice(0, particlesRef.current.length - MAX_PARTICLES);
      // Ripple
      ripplesRef.current.push({ x: cx, y: cy, r: 0, opacity: 0.55 });
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);

    // Idle ripple every 6s
    const idleInterval = setInterval(()=>{
      if (!enabled) return; // skip when disabled
      ripplesRef.current.push({ x: width/2, y: height/2, r: 0, opacity: 0.25 });
    },6000);

    // FPS adaptive throttle
    let skip = 0; // frames to skip when low FPS

    function step() {
      frameRef.current = requestAnimationFrame(step);
      if (!enabled) { ctx.clearRect(0,0,width,height); return; }
      frames.current++;
      const now = performance.now();
      if (now - lastFpsCheck.current > 1500) {
        const fps = frames.current * 1000 / (now - lastFpsCheck.current);
        fpsRef.current = fps;
        if (fps < 35) skip = 1; else if (fps < 25) skip = 2; else skip = 0;
        frames.current = 0; lastFpsCheck.current = now;
      }
      if (skip && (frames.current % (skip+1))) return; // crude throttle

      ctx.clearRect(0,0,width,height);
      const particles = particlesRef.current;

      // Update & draw particles
      for (let i=particles.length-1;i>=0;i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life++;
        // Wrap
        if (p.x < -50) p.x = width + 50; else if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50; else if (p.y > height + 50) p.y = -50;
        // Slight drift towards mouse
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x; const dy = mouseRef.current.y - p.y; const dist = Math.hypot(dx,dy);
          if (dist < 220) { p.vx += dx/dist * 0.002; p.vy += dy/dist * 0.002; }
        }
        // Fade out near end of life
        const lifeRatio = 1 - p.life / p.maxLife;
        if (p.life > p.maxLife) { particles.splice(i,1); continue; }
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue},75%,60%,${0.15 + 0.55*lifeRatio})`;
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();
      }
      // Respawn if low
      if (particles.length < MIN_PARTICLES) particles.push(spawnParticle());

      // Links
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x-b.x, dy = a.y-b.y; const dist = dx*dx+dy*dy;
          if (dist < 120*120) {
            const opacity = 0.12 * (1 - (Math.sqrt(dist)/120));
            ctx.strokeStyle = `hsla(${(a.hue+b.hue)/2},70%,55%,${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }

      // Ripples
      for (let r = ripplesRef.current.length -1; r>=0; r--) {
        const rp = ripplesRef.current[r];
        rp.r += 3; rp.opacity *= 0.965;
        if (rp.opacity < 0.02) { ripplesRef.current.splice(r,1); continue; }
        ctx.beginPath();
        ctx.strokeStyle = `hsla(45,100%,60%,${rp.opacity})`;
        ctx.lineWidth = 2;
        ctx.arc(rp.x,rp.y,rp.r,0,Math.PI*2);
        ctx.stroke();
      }
    }
    frameRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
      clearInterval(idleInterval);
    };
  }, [enabled]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1 right-2 text-[10px] font-mono px-2 py-1 rounded bg-background/70 backdrop-blur border border-border/60 shadow-sm pointer-events-none select-none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <div>FPS: {fpsRef.current.toFixed(0)}</div>
        <div>P: {particlesRef.current.length} R: {ripplesRef.current.length}</div>
      </div>
      <button
        type="button"
        onClick={toggleFx}
        className="fixed top-16 md:top-14 right-3 z-[60] text-[10px] md:text-xs px-2 py-1 rounded bg-secondary/80 hover:bg-secondary transition border border-border backdrop-blur-md shadow-sm"
        aria-pressed={enabled}
        aria-label="Toggle background effects"
      >
        {enabled ? 'FX: ON' : 'FX: OFF'}
      </button>
    </>
  );
};

export default InteractiveBackground;
