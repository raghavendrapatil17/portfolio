import React, { useEffect, useRef } from 'react';

// Famous equations + short python one-liners
const PHRASES = [
  'E = mc^2',
  '∂y/∂x = 0', // partial derivative
  'e^{iπ}+1=0', // Euler identity (e^{iπ}+1=0)
  'π ≈ 3.14159',
  '∫ e^{-x^2} dx = √π',
  'F=ma',
  'a^2+b^2=c^2',
  'print(sum(range(1,101)))',
  '[x**2 for x in range(5)]',
  'sorted(set(data))',
];

interface FloatingEquationsCanvasProps { className?: string; density?: number; }

const FloatingEquationsCanvas: React.FC<FloatingEquationsCanvasProps> = ({ className='', density = 10 }) => {
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const canvas = ref.current; if(!canvas) return; const ctx = canvas.getContext('2d'); if(!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resize=()=>{ 
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight } as DOMRect;
      const rectW = rect.width; const rectH = rect.height;
      canvas.width = rectW * dpr; canvas.height = rectH * dpr; canvas.style.width = rectW+'px'; canvas.style.height = rectH+'px';
      ctx.setTransform(1,0,0,1,0,0); // reset
      ctx.scale(dpr,dpr);
    };
    resize(); window.addEventListener('resize', resize);
    interface Eq { x:number;y:number;vx:number;vy:number;text:string;size:number;rot:number;vr:number;alpha:number; };
    const equations: Eq[] = Array.from({length: density}, (_,i)=>({
  x: Math.random()*(canvas.width/dpr),
  y: Math.random()*(canvas.height/dpr),
      vx:(Math.random()*0.4-0.2),
      vy:(Math.random()*0.4-0.2),
      text: PHRASES[Math.floor(Math.random()*PHRASES.length)],
      size: 14 + Math.random()*10,
      rot: Math.random()*Math.PI,
      vr: (Math.random()*0.4-0.2)*0.05,
  alpha: 0.35 + Math.random()*0.55,
    }));
    let last = performance.now(); let raf:number; let visible = true; const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries=>{ entries.forEach(en=>{ visible = en.isIntersecting; }); }, { threshold:0 });
    observer.observe(canvas);
    const onVis = ()=>{}; document.addEventListener('visibilitychange', onVis);
  // compute a visible color once (fallback to cyan if var unresolved)
  const rootStyle = getComputedStyle(document.documentElement);
  const primaryRaw = rootStyle.getPropertyValue('--primary') || '210 100% 60%';
  const baseColor = `hsl(${primaryRaw.trim()} / 0.8)`;
  const loop=()=>{ const now = performance.now(); const dt = (now-last)/16.67; last=now; ctx.clearRect(0,0,canvas.width,canvas.height); if(!document.hidden && visible && !prefersReduced.matches){ ctx.save(); equations.forEach(eq=>{ eq.x+=eq.vx*dt*2; eq.y+=eq.vy*dt*2; eq.rot+=eq.vr*dt; const w = canvas.width/dpr; const h = canvas.height/dpr; if(eq.x<-200) eq.x=w+200; if(eq.x>w+200) eq.x=-200; if(eq.y<-100) eq.y=h+100; if(eq.y>h+100) eq.y=-100; ctx.save(); ctx.translate(eq.x, eq.y); ctx.rotate(eq.rot); ctx.globalAlpha = eq.alpha; ctx.fillStyle=baseColor; ctx.font=`${eq.size}px ui-monospace, monospace`; ctx.fillText(eq.text,0,0); ctx.restore(); }); ctx.restore(); } raf=requestAnimationFrame(loop); };
    loop();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', resize); observer.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  },[density]);
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 z-[2] mix-blend-screen ${className}`} />;
};

export default FloatingEquationsCanvas;