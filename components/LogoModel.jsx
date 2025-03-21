import React, { useRef } from "react";
import { useControls } from "leva";
import { vertex, fragment } from "./shader";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2, Color } from "three";

const LogoModel = ({ logoPath = "/placeholder-logo.png" }) => {
  console.log("Attempting to load logo from:", logoPath);

  const { meltStrength, liquifyStrength } = useControls({
    meltStrength: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
    },
    liquifyStrength: {
      value: 0.3,
      min: 0,
      max: 1.0,
      step: 0.1,
    },
  });

  // Load texture with fallback to red plane
  let texture;
  try {
    texture = useLoader(TextureLoader, logoPath);
    console.log("Texture loaded successfully:", texture);
  } catch (e) {
    console.error("Logo texture failed to load:", e);
  }

  // Get mouse position and viewport
  const { mouse, viewport } = useThree();
  const mousePosition = useRef(new Vector2(0, 0));
  const time = useRef(0);

  const uniforms = useRef({
    uMousePosition: { value: mousePosition.current },
    uMeltStrength: { value: meltStrength },
    uLiquifyStrength: { value: liquifyStrength },
    uTime: { value: 0 },
    uTexture: { value: texture },
    uUseTexture: { value: !!texture },
    uColor: { value: new Color(1, 0, 0) },
  });

  const plane = useRef();
  useFrame((state, delta) => {
    // Update time for animation (slower update)
    time.current += delta * 0.2;

    // Convert normalized mouse position (-1 to 1) to plane coordinates
    mousePosition.current.x = (mouse.x * viewport.width) / 2;
    mousePosition.current.y = (mouse.y * viewport.height) / 2;

    // Update critical uniforms
    if (plane.current) {
      const material = plane.current.material;
      material.uniforms.uMousePosition.value = mousePosition.current;
      material.uniforms.uTime.value = time.current;

      // Only update these if they've changed
      if (material.uniforms.uMeltStrength.value !== meltStrength) {
        material.uniforms.uMeltStrength.value = meltStrength;
      }
      if (material.uniforms.uLiquifyStrength.value !== liquifyStrength) {
        material.uniforms.uLiquifyStrength.value = liquifyStrength;
      }
    }
  });

  return (
    <mesh ref={plane}>
      {/* Lower resolution geometry for better performance */}
      <planeGeometry args={[3, 3, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        wireframe={false}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
};

export default LogoModel;
