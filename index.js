import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

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

new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("../textures/earth-daymap-4k.jpg"),
});
const earthMesh = new THREE.Mesh(geo, material);
earthgrp.add(earthMesh);


const hemilight = new THREE.HemisphereLight("white", "black");
scene.add(hemilight);


function animate(t=0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    orbit.update();
}
animate();