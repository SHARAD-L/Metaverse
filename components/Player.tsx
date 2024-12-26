import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useInput } from "../hooks/useInput";
import { useFrame, useThree } from "@react-three/fiber";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuarternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

const directionOffset = ({ forward, backward, left, right }) => {
  let directionOffset = 0; // W
  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4; // W+A
    } else if (right) {
      directionOffset = -Math.PI / 4; // W+D
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2; // S+A
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; // S+D
    } else {
      directionOffset = Math.PI; // S
    }
  } else if (left) {
    directionOffset = Math.PI / 2; // A
  } else if (right) {
    directionOffset = -Math.PI / 2; // D
  }

  return directionOffset;
};

const Player = () => {
  const { forward, backward, left, right, jump, shift } = useInput();
  const model = useGLTF("./models/player.glb");
  const { actions } = useAnimations(model.animations, model.scene);

  model.scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      object.castShadow = true;
    }
  });

  const currentAction = useRef("");
  const controlsRef = useRef<typeof OrbitControls>();
  const camera = useThree((state) => state.camera);

  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const updateCameraPosition = () => {
    if (isUserInteracting) return; // Skip automatic updates during user interaction

    const offset = new THREE.Vector3(0, 2, 5); // Offset from the player's position
    const newCameraPosition = model.scene.position.clone().add(offset);

    // Smoothly transition the camera position
    camera.position.lerp(newCameraPosition, 0.1);

    // Update the camera target to always look at the player
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        model.scene.position.clone().add(new THREE.Vector3(0, 1.5, 0)), // Focus on upper body
        0.1
      );
    }
  };

  useEffect(() => {
    let action = "";

    if (forward || backward || left || right) {
      action = "walking";
      if (shift) {
        action = "running";
      }
    } else if (jump) {
      action = "jump";
    } else {
      action = "idle";
    }

    if (currentAction.current !== action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  }, [forward, backward, left, right, jump, shift]);

  useFrame((state, delta) => {
    if (currentAction.current === "running" || currentAction.current === "walking") {
      let angleYCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      );

      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      });

      // Rotate model
      rotateQuarternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      );
      model.scene.quaternion.rotateTowards(rotateQuarternion, 0.2);

      // Calculate direction
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset);

      // Run/Walk velocity
      const velocity = currentAction.current === "running" ? 10 : 5;

      // Move model & update camera
      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      model.scene.position.x += moveX;
      model.scene.position.z += moveZ;
    }

    // Update the camera position and target
    updateCameraPosition();
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping={true} // Smooth camera movements
        dampingFactor={0.1}
        enablePan={true} // Allow free panning
        enableZoom={true} // Allow zooming
        onStart={() => setIsUserInteracting(true)} // Start interaction
        onEnd={() => setIsUserInteracting(false)} // End interaction
      />
      <primitive object={model.scene} position={[0, 0, 0]} />
    </>
  );
};

export default Player;
