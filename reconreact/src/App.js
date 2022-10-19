// import logo from './logo.svg';
// import './App.css';
// import PlyViewer from './PlyViewer';
// import { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { Environment, OrbitControls } from "@react-three/drei";
// import meshobj from './assets/Lucy100k.ply'

// function App() {
//   return (
//     <div className="App">
//       <Canvas camera={{ position: [0, 10, 100] }}>
//           <Suspense fallback={null}>
//                <PlyViewer url={meshobj} />
//           </Suspense>
//           <OrbitControls />
//      </Canvas>
//     </div>
//   );
// }

// export default App;

import React from "react";

import * as THREE from "three";
//import { VRButton } from "three/examples/jsm/webxr/VRButton";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";
import Stats from "three/examples/jsm/libs/stats.module";
//import { MapControls } from "three/examples/jsm/controls/OrbitControls";

//import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
//import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

export default function App() {
  return <div className="App" />;
}
var container, stats;

var camera, cameraTarget, scene, renderer;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    15
  );
  camera.position.set(3, 0.15, 3);

  cameraTarget = new THREE.Vector3(0, -0.1, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x72645b);
  scene.fog = new THREE.Fog(0x72645b, 2, 15);

  // Ground

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;
  scene.add(plane);

  plane.receiveShadow = true;

  // PLY file

  var loader = new PLYLoader();
  // loader.load("dolphins_be.ply", function(geometry) {
  //   geometry.computeVertexNormals();

  //   var material = new THREE.MeshStandardMaterial({
  //     wireframe: true
  //   });
  //   var mesh = new THREE.Mesh(geometry, material);

  //   mesh.position.y = -0.2;
  //   mesh.position.z = 0.3;
  //   mesh.rotation.x = -Math.PI / 2;
  //   mesh.scale.multiplyScalar(0.001);

  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;

  //   scene.add(mesh);
  // });

  loader.load('merged.ply', function(geometry) {
    geometry.computeVertexNormals();

    var material = new THREE.MeshStandardMaterial({
      wireframe: true,

    });
  //   const material = new THREE.MeshPhysicalMaterial({
  //     color: 0xb2ffc8,
  //     envMap: envTexture,
  //     metalness: 0,
  //     roughness: 0,
  //     transparent: true,
  //     transmission: 1.0,
  //     side: THREE.DoubleSide,
  //     clearcoat: 1.0,
  //     clearcoatRoughness: 0.25
  // })
  
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = -0.2;
    mesh.position.y = -0.2;
    mesh.position.z = -0.2;
    mesh.scale.multiplyScalar(0.009);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
  });

  // Lights

  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

  addShadowedLight(1, 1, 1, 0xffffff, 1.35);
  addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  // stats

  stats = new Stats();
  container.appendChild(stats.dom);

  // resize

  window.addEventListener("resize", onWindowResize, false);
}

function addShadowedLight(x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.001;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  var timer = Date.now() * 0.0005;

  camera.position.x = Math.sin(timer) * 2.5;
  camera.position.z = Math.cos(timer) * 2.5;

  camera.lookAt(cameraTarget);

  renderer.render(scene, camera);
}