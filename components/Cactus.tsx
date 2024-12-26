import { useLoader } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

type RockType = {
  position: { x: number; z: number };
  box: number;
};

type Props = {
  boundary: number;
  count: number;
};

const Rocks: React.FC<Props> = ({ boundary, count }) => {
  const model = useLoader(GLTFLoader, "./models/cactus.glb");
  const [rocks, setRocks] = useState<RockType[]>([]);

  // Enable shadows for mesh objects
  model.scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      object.castShadow = true;
    }
  });

  const boxIntersect = (
    minAx: number,
    minAz: number,
    maxAx: number,
    maxAz: number,
    minBx: number,
    minBz: number,
    maxBx: number,
    maxBz: number
  ) => {
    let aLeft0fB = maxAx < minBx;
    let aRight0fB = minAx > maxBx;
    let aAboveB = minAz > maxBz;
    let aBelowB = maxAz < minBz;

    return !(aLeft0fB ||aRight0fB ||aAboveB ||aBelowB);
  };

  const isOverlapping = (
    index: number,
    rock: any,
    rocks: any[]    ) => {
        

        const minTargetX = rock.position.x - rock.box /2;
        const maxTargetX = rock.position.x - rock.box /2;
        const minTargetZ = rock.position.z - rock.box /2;
        const maxTargetZ = rock.position.z - rock.box /2;
        for(let i=0;i<index;i++){
            let minChildX = rocks[i].position.x - rocks[i].box /2;
            let maxChildX = rocks[i].position.x - rocks[i].box /2;
            let minChildZ = rocks[i].position.z - rocks[i].box /2;
            let maxChildZ = rocks[i].position.z - rocks[i].box /2;
            if(
                boxIntersect(
                    minTargetX,
                    minTargetZ,
                    maxTargetX,
                    maxTargetZ,
                    minChildX,
                    minChildZ,
                    maxChildX,
                    maxChildZ
                )
            ){
                
                return true;
            }
        }
        return false;
    };




    const newPosition = (box: number, boundary: number) => {
      let position;
      do {
        position =
          boundary / 2 -
          box / 2 -
          (boundary - box) * (Math.round(Math.random() * 100) / 100);
      } while (Math.abs(position) < 3); // Ensure position is outside the central 4 boxes
      return position;
    };
     
    // Update positions of rocks
    const updatePosition = (rockArray: RockType[], boundary: number) => {
      rockArray.forEach((rock, index) => {
        do {
          rock.position.x = newPosition(rock.box, boundary);
          rock.position.z = newPosition(rock.box, boundary);
        } while (isOverlapping(index, rock, rockArray));
      });
      setRocks(rockArray);
    };
    

  // Initialize rocks
  useEffect(() => {
    const tempRocks: RockType[] = [];
    for (let i = 0; i < count; i++) {
      tempRocks.push({ position: { x: 0, z: 0 }, box: 1 });
    }
    updatePosition(tempRocks, boundary);
  }, [boundary, count]);

  // Render rocks
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {rocks.map((rock, index) => (
        <object3D 
          key={index} 
          position={[rock.position.x, 0.01, rock.position.z]}
          scale={[5,5,5]}
        >
          {/* <mesh scale={[rock.box, rock.box, rock.box]}>
            <boxGeometry />
            <meshBasicMaterial color="blue" wireframe />
          </mesh> */}
          <primitive object={model.scene.clone()} />
        </object3D>
      ))}
    </group>
  );
};

export default Rocks;
