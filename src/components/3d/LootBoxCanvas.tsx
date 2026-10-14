"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Float,
  ContactShadows,
  Sparkles,
  Environment,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

function LootBoxModel({
  isUnlocking,
  onInspect,
}: {
  isUnlocking: boolean;
  onInspect: () => void;
}) {
  const { scene } = useGLTF("/models/lootbox.glb");
  const modelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const baseScale = 0.004;

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += isUnlocking ? delta * 8 : delta * 0.4;
      if (isUnlocking) {
        modelRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 20) * 0.05;
        modelRef.current.rotation.z =
          Math.cos(state.clock.elapsedTime * 20) * 0.05;
      } else {
        modelRef.current.rotation.x = 0;
        modelRef.current.rotation.z = 0;
      }
      const targetScale =
        hovered && !isUnlocking ? baseScale * 1.15 : baseScale;
      modelRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15,
      );
    }
  });

  return (
    <group
      ref={modelRef}
      dispose={null}
      onClick={onInspect}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/lootbox.glb");

export default function LootBoxCanvas({
  isUnlocking,
  onBoxClick,
}: {
  isUnlocking: boolean;
  onBoxClick: () => void;
}) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={isUnlocking ? 1 : 0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={isUnlocking ? 3 : 1.8}
          color={isUnlocking ? "#ef4444" : "#aa4fff"}
        />
        <directionalLight
          position={[-5, 4, -4]}
          intensity={1.2}
          color="#00e5ff"
        />
        {isUnlocking && (
          <pointLight
            position={[0, 0, 0]}
            intensity={10}
            color="#ef4444"
            distance={10}
          />
        )}
        <Environment preset="city" />
        <Center>
          <Float
            speed={isUnlocking ? 12 : 2.5}
            rotationIntensity={isUnlocking ? 0 : 0.8}
            floatIntensity={isUnlocking ? 0.5 : 1.5}
          >
            <LootBoxModel isUnlocking={isUnlocking} onInspect={onBoxClick} />
          </Float>
        </Center>
        <Sparkles
          count={isUnlocking ? 300 : 100}
          scale={isUnlocking ? 12 : 8}
          size={isUnlocking ? 6 : 3}
          speed={isUnlocking ? 5 : 0.8}
          color={isUnlocking ? "#ef4444" : "#00e5ff"}
        />
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.8}
          scale={15}
          blur={3}
          far={6}
          color="#000000"
        />
        <OrbitControls
          enableZoom={true}
          minDistance={3}
          maxDistance={40}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
          enablePan={false}
          dampingFactor={0.04}
          autoRotate={!isUnlocking}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
