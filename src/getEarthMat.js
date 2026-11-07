
import * as THREE from "three";

const loader = new THREE.TextureLoader();

function getEarthMat(sunDirection = new THREE.Vector3(-2, 0.5, 1.5)) {

    const uniforms = {
        dayTexture: { value: loader.load("./textures/earth-daymap-4k.jpg") },
        nightTexture: { value: loader.load("./textures/earth-nightmap-4k.jpg") },
        cloudsTexture: { value: loader.load("./textures/earth-clouds-4k.jpg") },
        sunDirection: { value: sunDirection.clone().normalize() }
    };

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
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D cloudsTexture;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
            float sunlight = dot(normalize(vNormal), normalize(sunDirection));
            float dayMix = smoothstep(-0.25, 0.5, sunlight);

            vec3 day = texture2D(dayTexture, vUv).rgb;
            vec3 night = texture2D(nightTexture, vUv).rgb;

            vec2 clouds = texture2D(cloudsTexture, vUv).rg;
            float cloudMix = smoothstep(0.0, 1.0, clouds.g) * dayMix;

            vec3 color = mix(night, day, dayMix);
            color = mix(color, vec3(1.0), cloudMix);

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    return new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader
    });
}

export { getEarthMat };
