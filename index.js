import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import { RGBELoader } from 'jsm/loaders/RGBELoader.js';

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    camera.aspect = w/h;
    camera.updateProjectionMatrix;
    renderer.setSize(w,h);
});

const Fov = 75;
const aspect = w/h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera( Fov , aspect , near , far);
camera.position.z = 2;
const scene = new THREE.Scene();

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./HDRI/output_4k.hdr", function (texture){
   texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; 
    scene.background = texture;
});


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.03;
const resetbutton = document.querySelector("#reset-btn");
resetbutton.addEventListener("click", () => {
    orbit.reset();
});

const earthgrp = new THREE.Group();
earthgrp.rotation.z= -23.4 * Math.PI/180;
scene.add(earthgrp);

const loader = new THREE.TextureLoader();

const specular = loader.load("./textures/earth-specular-4k.jpg");
const bump = loader.load("./textures/earth-bump-4k.jpg");
const color =loader.load("./textures/earth-daymap-4k.jpg");
const lights = loader.load("./textures/earth-nightmap-4k.jpg");
const clouds = loader.load("./textures/earth-clouds-4k.jpg");

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();
const sun = new THREE.DirectionalLight("white", 2);
sun.position.set(-2, 0.5, 1.5);
scene.add(sun);

const geo = new THREE.IcosahedronGeometry(1, 12);
const earthMat = new THREE.MeshStandardMaterial({
    map: color,
    bumpMap: bump,
    bumpScale: 1.2,
    roughnessMap: specular,
    roughness: 1,
});
const earthMesh = new THREE.Mesh(geo, earthMat);
earthgrp.add(earthMesh);

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
        vUv = uv;
        vNormal = normalize(mat3(modelMatrix) * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fragmentShader = `
    uniform sampler2D lightsTexture;
    uniform vec3 sunDirection;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    void main(){
        float sunlight = dot(normalize(vNormal), normalize(sunDirection));
            float night = 1.0 -smoothstep(-0.3, 0.3,sunlight);
            vec3 lights = texture2D(lightsTexture, vUv).rgb;
            gl_FragColor = vec4(lights, night);
    }
`;

const lightsMat = new THREE.ShaderMaterial({
    uniforms: {
        lightsTexture: { value: lights},
        sunDirection: { value: sunDirection }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthgrp.add(lightsMesh);
lightsMesh.scale.setScalar(1.0001);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: clouds,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.6
});

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.005);
earthgrp.add(glowMesh);

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