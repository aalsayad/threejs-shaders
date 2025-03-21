import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import LogoModel from "./LogoModel";

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4] }}
      dpr={[1, 2]} // Limit pixel ratio for performance
    >
      <color attach="background" args={["#000000"]} />
      <Suspense fallback={null}>
        <LogoModel logoPath="https://picsum.photos/512/512" />
      </Suspense>
    </Canvas>
  );
}

export default Scene;
