import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxHelper, Mesh } from "three";
import { useHelper } from "@react-three/drei";
import * as THREE from 'three'; // Import all of THREE


type Props = {
  isTesting: boolean;
};

const AnimatedBox: React.FC<Props> = ({ isTesting }) => {
  const meshRef = useRef<Mesh>(null);

  // Type casting meshRef to a MutableRefObject<Object3D> to resolve the type error
  if (isTesting) {
    useHelper(meshRef as React.MutableRefObject<THREE.Object3D>, BoxHelper, 5);
  }

  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
    }
  });

  const handlePointerMove = (e: any) => {
    if (e.buttons === 1) {
      // If the left mouse button is being held down, move the cube
      const newPos = meshRef.current?.position;
      if (newPos) {
        // Ensure we are always setting a valid 3-element array
        setPosition([
          newPos.x + e.movementX * 0.01,
          newPos.y - e.movementY * 0.01,
          newPos.z,
        ]);
      }
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[0.5, 0.5, 0.5]}
      onPointerMove={handlePointerMove}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default AnimatedBox;
