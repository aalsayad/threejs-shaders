export const vertex = `
    uniform vec2 uMousePosition;
    uniform float uPullStrength;
    uniform float uLiquifyStrength;
    uniform float uRadius;
    uniform float uTime;
    
    varying float vDistFactor;
    varying vec2 vUv;
    
    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
    
    void main() {
        vUv = uv;
        
        // Calculate direction and distance from vertex to mouse
        vec2 toMouse = uMousePosition - vec2(position.x, position.y);
        float dist = length(toMouse);
        
        // Normalize for direction
        vec2 dirToMouse = normalize(toMouse);
        
        // Calculate influence factor (1 at mouse, 0 at radius)
        float influence = 1.0 - smoothstep(0.0, uRadius, dist);
        vDistFactor = influence; // Pass to fragment shader for opacity
        
        // Base position
        vec3 newPosition = position;
        
        // 1. PULL effect - vertices get pulled toward the mouse
        vec2 pullOffset = -dirToMouse * influence * uPullStrength;
        
        // 2. LIQUIFY effect - organic flowing distortion
        // Use multiple noise layers for more organic feel
        float noise1 = snoise(vec2(position.x * 3.0 + uTime * 0.2, position.y * 3.0 + uTime * 0.3));
        float noise2 = snoise(vec2(position.x * 1.5 - uTime * 0.1, position.y * 1.5 + uTime * 0.2));
        float noise3 = snoise(vec2(position.x * 5.0 - uTime * 0.1, position.y * 5.0 - uTime * 0.2));
        
        float combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2) * 2.0; // Combine with weights
        
        // Apply liquify effect - stronger near mouse
        vec2 liquifyOffset = vec2(
            cos(combinedNoise * 6.28),
            sin(combinedNoise * 6.28)
        ) * influence * uLiquifyStrength;
        
        // Apply all offsets
        newPosition.x += pullOffset.x + liquifyOffset.x;
        newPosition.y += pullOffset.y + liquifyOffset.y;
        
        // Add some vertical displacement for 3D effect
        newPosition.z += influence * combinedNoise * uLiquifyStrength * 0.5;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

export const fragment = `
    uniform vec3 uColor;
    
    varying float vDistFactor;
    varying vec2 vUv;
    
    void main() {
        // Base color
        vec3 color = uColor;
        
        // 3. FADE effect - transparent at mouse position, solid far away
        float opacity = 1.0 - (vDistFactor * 1.2); // 1.2 multiplier helps create full transparency
        opacity = clamp(opacity, 0.0, 1.0);
        
        gl_FragColor = vec4(color, opacity);
    }
`;
