"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../components/Scene"), { ssr: false });

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Scene />
    </div>
  );
}
