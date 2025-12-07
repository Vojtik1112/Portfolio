"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// -----------------------------------------------------------------------------
// FLUID NOISE SHADER (Matches reference site aesthetic)
// -----------------------------------------------------------------------------

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// --------------------------------------------------------
// Simplex Noise Utils 
// --------------------------------------------------------
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// --------------------------------------------------------
// FBM & Domain Warping
// --------------------------------------------------------
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y; // Aspect correct
    
    // Scale up for detail
    st *= 3.0;

    // Domain Warping
    // Pattern: f(p) = fbm( p + fbm( p + time ) )
    
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.1 * uTime );
    q.y = fbm( st + vec2(1.0) );

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime );

    float f = fbm(st + r);

    // Color Mapping (Black & White Fluid)
    // We map the noise value to a smooth sine curve to create "bands"
    // Reference image shows smooth, thick white lines on black.
    
    float v = (f * f * 4.0 + 0.5); // Sharpen contrast
    
    // Create contour lines using sine
    // sin(v * frequency)
    float lines = 0.5 + 0.5 * sin(v * 20.0);
    
    // Smooth the lines (Topo map look)
    lines = smoothstep(0.4, 0.6, lines);
    
    // Make them look like glowing veins by inverting or creating ridges
    // Actually the reference is just smooth noise gradients, not strict lines.
    // Let's match the "Smoke" look:
    
    // Mix Colors
    vec3 color = mix(vec3(0.0), vec3(1.0), clamp(lines * f, 0.0, 1.0));
    
    // Vignette
    vec2 uv = vUv * 2.0 - 1.0;
    float vignette = 1.0 - dot(uv, uv) * 0.3;
    
    gl_FragColor = vec4(color * vignette, 1.0);
}
`;

const FluidScene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = clock.elapsedTime * 0.5; // Slow flow
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function PhysarumBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black">
      <Canvas
        dpr={[1, 2]} // Good quality
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <FluidScene />
      </Canvas>
    </div>
  );
}
