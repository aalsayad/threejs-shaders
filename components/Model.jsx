import React, { useRef } from "react";
import { useControls } from "leva";
import { vertex, fragment } from "./shader";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2, Color } from "three";

const Model = () => {
  const { pullStrength, liquifyStrength, radius, color } = useControls({
    pullStrength: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01,
    },
    liquifyStrength: {
      value: 0.4,
      min: 0,
      max: 1.5,
      step: 0.01,
    },
    radius: {
      value: 1.5,
      min: 0.1,
      max: 3.0,
      step: 0.1,
    },
    color: "#ff0000",
  });

  // Get mouse position and viewport
  const { mouse, viewport } = useThree();
  const mousePosition = useRef(new Vector2(0, 0));
  const time = useRef(0);
  const colorObj = new Color(color);

  const uniforms = useRef({
    uMousePosition: { value: mousePosition.current },
    uPullStrength: { value: pullStrength },
    uLiquifyStrength: { value: liquifyStrength },
    uRadius: { value: radius },
    uTime: { value: 0 },
    uColor: { value: new Color(colorObj.r, colorObj.g, colorObj.b) },
  });

  const plane = useRef();
  useFrame((state, delta) => {
    // Update time for animation (slower for smoother flow)
    time.current += delta * 0.5;

    // Convert normalized mouse position (-1 to 1) to match our plane coordinates
    mousePosition.current.x = (mouse.x * viewport.width) / 2;
    mousePosition.current.y = (mouse.y * viewport.height) / 2;

    // Update all uniforms
    plane.current.material.uniforms.uMousePosition.value =
      mousePosition.current;
    plane.current.material.uniforms.uPullStrength.value = pullStrength;
    plane.current.material.uniforms.uLiquifyStrength.value = liquifyStrength;
    plane.current.material.uniforms.uRadius.value = radius;
    plane.current.material.uniforms.uTime.value = time.current;
    plane.current.material.uniforms.uColor.value = new Color(color);
  });

  return (
    <mesh ref={plane}>
      <planeGeometry args={[3, 3, 96, 96]} />{" "}
      {/* Higher resolution for smoother distortion */}
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

export default Model;
