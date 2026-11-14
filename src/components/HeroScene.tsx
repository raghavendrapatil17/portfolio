"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ pointer, clock }, dt) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.y += dt * 0.12;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, pointer.y * 0.4, 0.05);
    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, -pointer.x * 0.3, 0.05);
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, pointer.x * 0.25, 0.04);
    mesh.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.02);
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 64]} />
        <MeshDistortMaterial
          color="#6d5dfc"
          emissive="#1b1250"
          roughness={0.12}
          metalness={0.85}
          distort={0.38}
          speed={1.6}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.08; });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.3, 0.2, 0]}>
      <torusGeometry args={[2.6, 0.006, 16, 220]} />
      <meshBasicMaterial color="#8b7bff" transparent opacity={0.45} />
    </mesh>
  );
}

function Particles({ count = 900 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // Deterministic PRNG keeps render pure and the layout stable between reloads
    let seed = 42;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + random() * 3.2;
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
    ref.current.rotation.y += dt * 0.03;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, pointer.y * 0.15, 0.03);
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
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#22d3ee" />
      <pointLight position={[3, -3, -2]} intensity={25} color="#a78bfa" />
      <Blob />
      <Ring />
      <Particles />
      <Environment resolution={256}>
        <Lightformer intensity={2} color="#a78bfa" position={[0, 3, -4]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.6} color="#22d3ee" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer intensity={1.2} color="#ffffff" position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[4, 4, 1]} />
      </Environment>
    </Canvas>
  );
}
