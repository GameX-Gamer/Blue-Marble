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


const geo = new THREE.IcosahedronGeometry(1, 2);
const material = new THREE.MeshStandardMaterial({
    color: "red",
    flatShading: true
});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);


const hemilight = new THREE.HemisphereLight("white", "black");
scene.add(hemilight);


function animate(t=0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    orbit.update();
}
animate();