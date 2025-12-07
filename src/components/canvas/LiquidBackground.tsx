"use client";

import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sphere,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const LiquidChrome = () => {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 64, 64]} scale={2}>
          <MeshDistortMaterial
            color="#1a1a1a"
            attach="material"
            distort={0.5} // Liquid effect intensity
            speed={2} // Slow oozing
            roughness={0.2}
            metalness={1.0} // Chrome look
          />
        </Sphere>
      </Float>
      <Environment preset="city" />
    </group>
  );
};

export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <LiquidChrome />
      </Canvas>
    </div>
  );
}
