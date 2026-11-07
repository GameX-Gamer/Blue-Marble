import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
//import { getEarthMat } from "./src/getEarthMat.js";

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const Fov = 75;
const aspect = w/h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera( Fov , aspect , near , far);
camera.position.z = 2;
const scene = new THREE.Scene();

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.03;


const earthgrp = new THREE.Group();
earthgrp.rotation.z= -23.4 * Math.PI/180;
scene.add(earthgrp);

const loader = new THREE.TextureLoader();

const color =loader.load("./textures/earth-daymap-4k.jpg");
const lights = loader.load("./textures/earth-nightmap-4k.jpg");
const clouds = loader.load("./textures/earth-clouds-4k.jpg");

const sun = new THREE.DirectionalLight("white", 2);
sun.position.set(-2, 0.5, 1.5);
scene.add(sun);

const geo = new THREE.IcosahedronGeometry(1, 12);
const earthMat = new THREE.MeshStandardMaterial({
    map: color
});
const earthMesh = new THREE.Mesh(geo, earthMat);
earthgrp.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: lights,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5,
});

const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthgrp.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: clouds,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5
});

const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.01);
earthgrp.add(cloudsMesh);

color.colorSpace = THREE.SRGBColorSpace;
lights.colorSpace = THREE.SRGBColorSpace;

function animate(t=0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y = t * 0.0001;
    lightsMesh.rotation.y = t * 0.0001;
    cloudsMesh.rotation.y = t * 0.00013;
    renderer.render(scene, camera);
    orbit.update();
}
animate();