import * as THREE from "three";

function getFresnelMat(){
    const uniforms = {
        glowColor: { value: new THREE.Color(0x0088ff)}
    };
    const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition; 

    void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
        }
    `;
    const fragmentShader = `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main(){
            float fresnel = 0.85 - max(
                dot(normalize(vNormal), normalize(vViewPosition)),
                0.0
            );
            float glow = pow(fresnel, 3.0);
            gl_FragColor = vec4(glowColor, glow);
        }
    `;
    return new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
}
export { getFresnelMat };
