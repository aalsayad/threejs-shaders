import React from "react";
import { useControls } from "leva";
import { vertex, fragment } from "./shader";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Model = () => {
  const { amplitude, waveLength } = useControls({
    amplitude: {
      value: 0.25,
      min: 0,
      max: 5,
      step: 0.05,
    },
    waveLength: {
      value: 5,
      min: 0,
      max: 20,
      step: 1,
    },
  });

  const uniforms = useRef({
    uAmplitude: { value: amplitude },
    uWaveLength: { value: waveLength },
  });

  const plane = useRef();
  useFrame(() => {
    plane.current.material.uniforms.uAmplitude.value = amplitude;
    plane.current.material.uniforms.uWaveLength.value = waveLength;
  });
  return (
    <mesh ref={plane}>
      <planeGeometry args={[3, 3, 35, 35]} />
      {/* <meshBasicMaterial color="red" wireframe={true} /> */}
      <shaderMaterial
        //Vertices
        fragmentShader={fragment}
        //colors
        vertexShader={vertex}
        wireframe={true}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

export default Model;
