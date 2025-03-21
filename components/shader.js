export const vertex = `
    uniform float uAmplitude;
    uniform float uWaveLength;
    
    void main() {
        vec3 newPosition = position;
        float wave = uAmplitude * sin(position.x * uWaveLength);
        newPosition.z += wave;
        gl_Position= projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    }
`;

export const fragment = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;
