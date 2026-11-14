"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLiteMode } from "@/lib/motion";

/* Ashima 3D simplex noise (MIT) */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertex = /* glsl */ `
uniform float uTime; uniform float uScroll; uniform vec2 uMouse; uniform float uHover;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
${NOISE}
float field(vec3 p){
  float t = uTime * 0.28;
  float n = snoise(p * 1.1 + vec3(t, t * 0.6, -t));
  n += 0.45 * snoise(p * 2.6 - vec3(0.0, t * 1.4, t));
  return n;
}
float pullAt(vec3 p){
  vec3 mouseDir = normalize(vec3(uMouse * 1.6, 1.0));
  return pow(max(dot(normalize(p), mouseDir), 0.0), 3.0) * (0.15 + uHover * 0.25);
}
vec3 displace(vec3 p, float amp){
  return p + normalize(p) * (field(p) * amp + pullAt(p));
}
void main(){
  // Mouse pulls a bulge toward the cursor; scrolling increases turbulence
  float amp = 0.24 + uScroll * 0.55;
  vec3 p = position;
  vec3 d = displace(p, amp);
  // Recompute the normal from two displaced neighbours
  vec3 tangent = normalize(cross(normal, abs(normal.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
  vec3 bitangent = normalize(cross(normal, tangent));
  float e = 0.015;
  vec3 da = displace(normalize(p + tangent * e) * length(p), amp);
  vec3 db = displace(normalize(p + bitangent * e) * length(p), amp);
  vec3 nrm = normalize(cross(da - d, db - d));
  if (dot(nrm, normal) < 0.0) nrm = -nrm;
  vNormal = normalize(normalMatrix * nrm);
  vec4 mv = modelViewMatrix * vec4(d, 1.0);
  vView = normalize(-mv.xyz);
  vNoise = field(p);
  gl_Position = projectionMatrix * mv;
}`;

const fragment = /* glsl */ `
uniform float uTime; uniform float uScroll;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
// Cosine palette (Inigo Quilez) tuned to violet → blue → cyan
vec3 palette(float t){
  vec3 a = vec3(0.45, 0.42, 0.78); vec3 b = vec3(0.30, 0.28, 0.25);
  vec3 c = vec3(1.0, 1.0, 1.0);    vec3 d = vec3(0.62, 0.70, 0.80);
  return a + b * cos(6.28318 * (c * t + d));
}
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
  float t = vNoise * 0.3 + fres * 0.55 + uTime * 0.03 + uScroll * 0.3;
  vec3 deep = vec3(0.07, 0.05, 0.26);
  vec3 base = mix(deep, palette(t), 0.35 + fres * 0.65);
  vec3 lightDir = normalize(vec3(0.5, 0.8, 0.6));
  float diff = max(dot(vNormal, lightDir), 0.0);
  float spec = pow(max(dot(reflect(-lightDir, vNormal), vView), 0.0), 48.0);
  vec3 col = base * (0.55 + diff * 0.6) + spec * 0.85 + fres * vec3(0.55, 0.5, 1.0) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`;

/** Normalised scroll through the first viewport (0 → 1). Read every frame. */
function heroScroll() {
  if (typeof window === "undefined") return 0;
  return Math.min(window.scrollY / window.innerHeight, 1);
}

function Blob({ detail }: { detail: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const initialUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uHover: { value: 0 } }),
    [],
  );
  useFrame(({ pointer, clock }) => {
    const m = mesh.current;
    const u = mat.current?.uniforms;
    if (!m || !u) return;
    const s = heroScroll();
    u.uTime.value = clock.getElapsedTime();
    u.uScroll.value = THREE.MathUtils.lerp(u.uScroll.value, s, 0.08);
    (u.uMouse.value as THREE.Vector2).lerp(pointer, 0.06);
    u.uHover.value = THREE.MathUtils.lerp(u.uHover.value, Math.min(pointer.length(), 1), 0.05);
    m.rotation.y += 0.0025 + s * 0.01;
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, pointer.y * 0.35 + s * 0.8, 0.05);
    m.position.x = THREE.MathUtils.lerp(m.position.x, pointer.x * 0.25, 0.04);
    m.position.y = THREE.MathUtils.lerp(m.position.y, pointer.y * 0.15 - s * 0.6, 0.05);
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, 1 - s * 0.25, 0.08));
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, detail]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={initialUniforms} />
    </mesh>
  );
}

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const s = heroScroll();
    if (a.current) { a.current.rotation.z += dt * 0.08; a.current.rotation.x = Math.PI / 2.3 + s * 0.6; }
    if (b.current) { b.current.rotation.z -= dt * 0.05; b.current.rotation.y = 0.5 - s * 0.8; }
  });
  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[2.6, 0.006, 16, 220]} />
        <meshBasicMaterial color="#8b7bff" transparent opacity={0.45} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 1.8, 0.5, 0.3]}>
        <torusGeometry args={[3.1, 0.004, 16, 220]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

function Particles({ count = 1400 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // Deterministic PRNG keeps render pure and the layout stable between reloads
    let seed = 42;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + random() * 3.6;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  useFrame(({ pointer }, dt) => {
    if (!ref.current) return;
    const s = heroScroll();
    ref.current.rotation.y += dt * (0.03 + s * 0.25);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, pointer.y * 0.15, 0.03);
    ref.current.scale.setScalar(1 + s * 0.6);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#c4b5fd" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene() {
  const { reduced, lowPower } = useLiteMode();
  // Reduced motion: a still, softly lit orb instead of a live WebGL scene
  if (reduced) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-[60%] aspect-square rounded-full blur-[2px]" style={{ background: "radial-gradient(circle at 35% 30%, #c4b5fd, #6d5dfc 40%, #1b1250 75%)", boxShadow: "0 0 120px 20px rgb(109 93 252 / 0.35)" }} />
      </div>
    );
  }
  return (
    <Canvas
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <Blob detail={lowPower ? 48 : 96} />
      <Rings />
      <Particles count={lowPower ? 500 : 1400} />
    </Canvas>
  );
}
