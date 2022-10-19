import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";
import { DDSLoader } from "three-stdlib";

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());
const PlyViewer = ({url}) => {
    const geom = useLoader(PLYLoader, url);

    const ref = useRef();
    const {camera} = useThree();
    useEffect(() => {
        camera.lookAt(ref.current.position);
    });

    return (
        <>
            <mesh ref={ref}>
                <primitive object={geom} attach="geometry"/>
                {/* <meshStandardMaterial color={"orange"}/> */}
            </mesh>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
        </>
    );
};

export default PlyViewer