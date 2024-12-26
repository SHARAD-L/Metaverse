import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper, DirectionalLight } from "three";
import * as THREE from 'three'; // Import all of THREE


const Lights: React.FC = () => {
    const lightRef = useRef<DirectionalLight>(null);

    // Type cast the ref to MutableRefObject<Object3D> to avoid TypeScript error
    useHelper(lightRef as React.MutableRefObject<THREE.Object3D>, DirectionalLightHelper, 5, "red");

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight 
            ref={lightRef} 
            position={[0, 10, 10]} 
            castShadow
            shadow-mapSize-height={1000}
            shadow-mapSize-width={1000}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            />
            <hemisphereLight args={["#7cdbe6","5e9c49",0.7]}/>
        </>
    );
};

export default Lights;
