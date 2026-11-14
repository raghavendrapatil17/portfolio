"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useLiteMode } from "@/lib/motion";
import { setHud, useHud } from "@/lib/latentHud";

/**
 * "Latent space" hero: a 3D embedding space of topic clusters. The cursor acts
 * as a query vector — nearby points light up and lines retrieve its top-k
 * nearest neighbours, with pulses flowing back to the query, just like the
 * retrieval step of a RAG pipeline. When idle, the query drifts on its own.
 */

export const CLUSTERS = [
  { name: "LLMs", color: "#a78bfa" },
  { name: "RAG", color: "#22d3ee" },
  { name: "Agents", color: "#f472b6" },
  { name: "Angular", color: "#60a5fa" },
  { name: "Dynamics 365", color: "#34d399" },
  { name: "Data & BI", color: "#fbbf24" },
] as const;

const TOP_K = 8;
const QUERY_RADIUS = 0.75;

type Space = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
  cluster: Int8Array;
  centers: THREE.Vector3[];
  edges: Float32Array;
  edgeColors: Float32Array;
  count: number;
};

/** Deterministic so the space looks identical on every visit (and render stays pure). */
function buildSpace(perCluster: number, noise: number): Space {
  let seed = 1337;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => {
    const u = Math.max(rand(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };

  // Cluster centres spread evenly over a sphere (Fibonacci lattice)
  const centers = CLUSTERS.map((_, i) => {
    const y = 1 - (i / (CLUSTERS.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    return new THREE.Vector3(Math.cos(th) * r, y * 0.8, Math.sin(th) * r).multiplyScalar(1.45);
  });

  const count = perCluster * CLUSTERS.length + noise;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const cluster = new Int8Array(count);
  const c = new THREE.Color();

  let i = 0;
  CLUSTERS.forEach((cl, ci) => {
    c.set(cl.color);
    for (let n = 0; n < perCluster; n++, i++) {
      const sigma = 0.32;
      positions[i * 3] = centers[ci].x + gauss() * sigma;
      positions[i * 3 + 1] = centers[ci].y + gauss() * sigma;
      positions[i * 3 + 2] = centers[ci].z + gauss() * sigma;
      colors.set([c.r, c.g, c.b], i * 3);
      sizes[i] = 1.4 + rand() * 2.2;
      phases[i] = rand() * Math.PI * 2;
      cluster[i] = ci;
    }
  });
  // Background "unlabelled" embeddings
  c.set("#8b8fb0");
  for (; i < count; i++) {
    const r = 1.2 + rand() * 1.3;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    positions.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.75, r * Math.sin(ph) * Math.sin(th)], i * 3);
    colors.set([c.r, c.g, c.b], i * 3);
    sizes[i] = 0.9 + rand() * 1.2;
    phases[i] = rand() * Math.PI * 2;
    cluster[i] = -1;
  }

  // Knowledge-graph edges: link each clustered point to its nearest neighbour in-cluster
  const edgeList: number[] = [];
  const edgeCol: number[] = [];
  for (let a = 0; a < perCluster * CLUSTERS.length; a++) {
    let best = -1;
    let bestD = Infinity;
    const start = cluster[a] * perCluster;
    for (let b = start; b < start + perCluster; b++) {
      if (b === a) continue;
      const dx = positions[a * 3] - positions[b * 3];
      const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
      const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) { bestD = d; best = b; }
    }
    if (best > a || cluster[best] !== cluster[a]) {
      edgeList.push(...positions.subarray(a * 3, a * 3 + 3), ...positions.subarray(best * 3, best * 3 + 3));
      edgeCol.push(...colors.subarray(a * 3, a * 3 + 3), ...colors.subarray(best * 3, best * 3 + 3));
    }
  }

  return { positions, colors, sizes, phases, cluster, centers, edges: new Float32Array(edgeList), edgeColors: new Float32Array(edgeCol), count };
}

const pointsVertex = /* glsl */ `
attribute float aSize; attribute float aPhase; attribute vec3 aColor;
uniform float uTime; uniform vec3 uQuery; uniform float uRadius; uniform float uPixelRatio;
varying vec3 vColor; varying float vAlpha;
void main(){
  vec3 p = position + 0.025 * vec3(sin(uTime*0.6+aPhase), cos(uTime*0.5+aPhase*1.3), sin(uTime*0.4+aPhase*0.7));
  float d = distance(p, uQuery);
  float h = 1.0 - smoothstep(0.0, uRadius, d);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.75 + 0.25 * sin(uTime * 2.0 + aPhase * 6.2831);
  gl_PointSize = aSize * (1.0 + h * 1.9) * tw * uPixelRatio * (22.0 / -mv.z);
  vColor = mix(aColor * 0.75, vec3(1.0), h * 0.55);
  vAlpha = 0.32 + 0.68 * h + 0.12 * tw;
}`;

const pointsFragment = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main(){
  float r = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, r), 1.6);
  gl_FragColor = vec4(vColor, a * vAlpha);
}`;

/** Last known mouse position in viewport pixels (null until the mouse moves). */
const mouse = { x: 0, y: 0, seen: false };
function useMouseTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

function heroScroll() {
  if (typeof window === "undefined") return 0;
  return Math.min(window.scrollY / window.innerHeight, 1);
}

function makeScratch() {
  return {
    query: new THREE.Vector3(1.2, 0.3, 0.6),
    target: new THREE.Vector3(),
    ray: new THREE.Raycaster(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    hit: new THREE.Vector3(),
    invQuat: new THREE.Quaternion(),
    lastPointer: new THREE.Vector2(9, 9),
    ndc: new THREE.Vector2(),
    lastMove: -10,
    topIdx: new Int32Array(TOP_K),
    topD: new Float32Array(TOP_K),
    votes: new Float32Array(CLUSTERS.length),
  };
}

function LatentSpace({ perCluster, noise }: { perCluster: number; noise: number }) {
  const space = useMemo(() => buildSpace(perCluster, noise), [perCluster, noise]);
  useMouseTracker();
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const pulses = useRef<THREE.Points>(null);
  const marker = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);

  // Mutable per-frame scratch state lives in a ref (created on first frame, never reallocated)
  const scratchRef = useRef<ReturnType<typeof makeScratch> | null>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uQuery: { value: new THREE.Vector3() }, uRadius: { value: QUERY_RADIUS }, uPixelRatio: { value: 1 } }),
    [],
  );
  const linePositions = useMemo(() => new Float32Array(TOP_K * 6), []);
  const lineColors = useMemo(() => new Float32Array(TOP_K * 6), []);
  const pulsePositions = useMemo(() => new Float32Array(TOP_K * 2 * 3), []);

  useFrame((state, dt) => {
    const g = group.current;
    const u = mat.current?.uniforms;
    if (!g || !u) return;
    const t = state.clock.getElapsedTime();
    const s = heroScroll();
    const k = (scratchRef.current ??= makeScratch());
    // Mouse → normalised device coords relative to the canvas itself (it is offset on the page)
    const rect = state.gl.domElement.getBoundingClientRect();
    if (mouse.seen && rect.width > 0) {
      k.ndc.set(((mouse.x - rect.left) / rect.width) * 2 - 1, -((mouse.y - rect.top) / rect.height) * 2 + 1);
    }

    // Group motion: slow spin, pointer tilt, scroll dives into the space
    g.rotation.y += dt * (0.05 + s * 0.35);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, THREE.MathUtils.clamp(k.ndc.y, -1, 1) * 0.18 + s * 0.5, 0.04);
    // Sits right of centre so the clusters clear the headline; scroll dives in
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, 0.9 + s * 0.55, 0.08));
    g.position.x = THREE.MathUtils.lerp(g.position.x, 0.7 - s * 0.5, 0.08);
    g.position.y = THREE.MathUtils.lerp(g.position.y, -0.15 - s * 0.5, 0.08);
    g.updateMatrixWorld();

    // Query vector: follows the cursor, drifts on a Lissajous path when idle
    if (!k.lastPointer.equals(k.ndc)) { k.lastPointer.copy(k.ndc); k.lastMove = t; }
    const idle = t - k.lastMove > 2.5;
    if (!idle) {
      k.ray.setFromCamera(k.ndc, state.camera);
      if (k.ray.ray.intersectPlane(k.plane, k.hit)) k.target.copy(k.hit).clampLength(0, 2.7);
    } else {
      k.target.set(Math.cos(t * 0.35) * 1.5, Math.sin(t * 0.52) * 0.9, Math.sin(t * 0.27) * 0.8);
    }
    g.worldToLocal(k.target);
    k.query.lerp(k.target, idle ? 0.03 : 0.12);
    u.uQuery.value.copy(k.query);
    u.uTime.value = t;
    u.uPixelRatio.value = state.viewport.dpr;

    // Exact top-k nearest neighbours (brute force over ~2k points is trivial per frame)
    k.topD.fill(Infinity);
    k.topIdx.fill(-1);
    const P = space.positions;
    const qx = k.query.x, qy = k.query.y, qz = k.query.z;
    for (let i = 0; i < space.count; i++) {
      const dx = P[i * 3] - qx, dy = P[i * 3 + 1] - qy, dz = P[i * 3 + 2] - qz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d >= k.topD[TOP_K - 1]) continue;
      let j = TOP_K - 1;
      while (j > 0 && k.topD[j - 1] > d) { k.topD[j] = k.topD[j - 1]; k.topIdx[j] = k.topIdx[j - 1]; j--; }
      k.topD[j] = d;
      k.topIdx[j] = i;
    }

    // Retrieval lines + pulses travelling from each neighbour to the query
    const votes = k.votes.fill(0);
    for (let n = 0; n < TOP_K; n++) {
      const idx = k.topIdx[n];
      const px = P[idx * 3], py = P[idx * 3 + 1], pz = P[idx * 3 + 2];
      linePositions.set([qx, qy, qz, px, py, pz], n * 6);
      const fade = 1 - n / TOP_K;
      lineColors.set([1, 1, 1, space.colors[idx * 3] * fade, space.colors[idx * 3 + 1] * fade, space.colors[idx * 3 + 2] * fade], n * 6);
      for (let m = 0; m < 2; m++) {
        const f = (t * 0.9 + n * 0.37 + m * 0.5) % 1;
        pulsePositions.set([px + (qx - px) * f, py + (qy - py) * f, pz + (qz - pz) * f], (n * 2 + m) * 3);
      }
      if (space.cluster[idx] >= 0) votes[space.cluster[idx]] += fade;
    }
    const lg = lines.current?.geometry;
    if (lg) { lg.attributes.position.needsUpdate = true; lg.attributes.color.needsUpdate = true; }
    const pg = pulses.current?.geometry;
    if (pg) pg.attributes.position.needsUpdate = true;

    // Query marker faces the camera; halo breathes
    if (marker.current) {
      marker.current.position.copy(k.query);
      g.getWorldQuaternion(k.invQuat).invert();
      marker.current.quaternion.copy(k.invQuat).multiply(state.camera.quaternion);
    }
    if (halo.current) halo.current.scale.setScalar(1 + 0.25 * Math.sin(t * 3));

    // Report the winning cluster + a cosine-style similarity to the HUD
    let best = -1, bestV = 0;
    votes.forEach((v, i) => { if (v > bestV) { bestV = v; best = i; } });
    const sim = Math.max(0, Math.min(0.99, 1 - Math.sqrt(k.topD[0]) / 1.2));
    setHud({ cluster: best >= 0 ? CLUSTERS[best].name : "unlabelled", score: Math.round(sim * 100) / 100, active: best });
  });

  return (
    <group ref={group}>
      {/* Embeddings */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[space.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[space.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[space.sizes, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[space.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={mat} vertexShader={pointsVertex} fragmentShader={pointsFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Knowledge-graph edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[space.edges, 3]} />
          <bufferAttribute attach="attributes-color" args={[space.edgeColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Top-k retrieval lines */}
      <lineSegments ref={lines} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} usage={THREE.DynamicDrawUsage} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Pulses flowing back to the query */}
      <points ref={pulses} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#ffffff" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Query marker */}
      <group ref={marker}>
        <mesh>
          <circleGeometry args={[0.035, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh ref={halo}>
          <ringGeometry args={[0.09, 0.1, 48]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.8} />
        </mesh>
        <mesh>
          <ringGeometry args={[QUERY_RADIUS * 0.55, QUERY_RADIUS * 0.555, 64]} />
          <meshBasicMaterial color="#8b7bff" transparent opacity={0.18} />
        </mesh>
      </group>

      <ClusterLabels centers={space.centers} />
    </group>
  );
}

function ClusterLabels({ centers }: { centers: THREE.Vector3[] }) {
  const hud = useHud();
  const wrapper = useThree((st) => st.gl.domElement.parentElement as HTMLElement);
  const portal = useMemo(() => ({ current: wrapper }), [wrapper]);
  // On narrow screens the scene is a dim backdrop behind text: labels would just add noise
  const narrow = useThree((st) => st.size.width < 640);
  if (narrow) return null;
  return (
    <>
      {CLUSTERS.map((c, i) => (
        <Html key={c.name} portal={portal} position={centers[i].clone().multiplyScalar(1.28)} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <span
            className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border transition-all duration-500"
            style={{
              color: hud.active === i ? "#0b0b10" : c.color,
              background: hud.active === i ? c.color : "rgba(6,7,10,0.55)",
              borderColor: `${c.color}55`,
              boxShadow: hud.active === i ? `0 0 24px ${c.color}88` : "none",
              opacity: hud.active === i ? 1 : 0.7,
            }}
          >
            {c.name}
          </span>
        </Html>
      ))}
    </>
  );
}

export default function HeroScene() {
  const { reduced, lowPower } = useLiteMode();
  // Reduced motion: a still constellation glow instead of a live WebGL scene
  if (reduced) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-[60%] aspect-square rounded-full" style={{ background: "radial-gradient(circle at 50% 50%, rgb(139 123 255 / 0.35), rgb(34 211 238 / 0.12) 45%, transparent 70%)" }} />
      </div>
    );
  }
  return (
    <Canvas
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <LatentSpace perCluster={lowPower ? 140 : 260} noise={lowPower ? 160 : 340} />
    </Canvas>
  );
}
