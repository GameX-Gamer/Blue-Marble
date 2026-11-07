import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { getEarthMat } from "./src/getEarthMat.js";

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

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();
const sun = new THREE.DirectionalLight("white");
sun.position.set(-2, 0.5, 1.5);
scene.add(sun);

const geo = new THREE.IcosahedronGeometry(1, 12);
const material = getEarthMat(sunDirection);
const earthMesh = new THREE.Mesh(geo, material);
earthgrp.add(earthMesh);


function animate(t=0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    orbit.update();
}
animate();