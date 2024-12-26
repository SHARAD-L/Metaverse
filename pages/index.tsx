import type { NextPage } from 'next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats} from '@react-three/drei';
import Lights from '../components/Lights';
import Ground from '../components/Ground';
import Rock from '../components/Rock';
import Cactus from '../components/Cactus';
import Player from '../components/Player';



const Home: NextPage = () => {
  const testing = true;

  return (
    <div className="container">
      <Canvas shadows>
        {testing ? <Stats /> : null}
        {testing ? <axesHelper args={[2]} /> : null}
        {testing ? <gridHelper args={[10, 10]} /> : null}
        <OrbitControls />
        <perspectiveCamera/>
        <Rock boundary={60} count={30}/>
        <Cactus boundary={60} count={30}/>
        <Lights/>
        <Player/>
        <Ground/>  
      </Canvas>
    </div>
  );
};

export default Home;
