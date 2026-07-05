"use client";

/**
 * GitHub Globe (adapted from Aceternity UI "GitHub Globe") — three-globe
 * rendered via react-three-fiber. ALWAYS import this file dynamically with
 * `ssr: false` — it pulls in three.js + three-globe.
 */

import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, type ThreeElement } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import { Color, Fog, PerspectiveCamera, Scene, Vector3 } from "three";
import countries from "./globe-countries.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElement<typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const ASPECT = 1.2;
const CAMERA_Z = 300;

export type GlobeArc = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
};

type GlobeConfig = {
  globeColor: string;
  emissive: string;
  polygonColor: string;
  atmosphereColor: string;
  arcColor: string;
  pointColor: string;
};

function readAccent(): GlobeConfig {
  const styles = getComputedStyle(document.body);
  const accent = styles.getPropertyValue("--color-accent").trim() || "#34d399";
  const rgb = styles.getPropertyValue("--accent-rgb").trim() || "52, 211, 153";
  return {
    globeColor: "#0c0a09",
    emissive: "#15110e",
    polygonColor: `rgba(${rgb}, 0.55)`,
    atmosphereColor: accent,
    arcColor: accent,
    pointColor: accent,
  };
}

function GlobeMesh({ arcs }: { arcs: GlobeArc[] }) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !initialized) return;
    const cfg = readAccent();

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(cfg.globeColor);
    globeMaterial.emissive = new Color(cfg.emissive);
    globeMaterial.emissiveIntensity = 0.15;
    globeMaterial.shininess = 0.9;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor(cfg.atmosphereColor)
      .atmosphereAltitude(0.12)
      .hexPolygonColor(() => cfg.polygonColor);

    const points = arcs.flatMap((a) => [
      { lat: a.startLat, lng: a.startLng },
      { lat: a.endLat, lng: a.endLng },
    ]);

    globeRef.current
      .arcsData(arcs)
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor(() => cfg.arcColor)
      .arcAltitude((d: any) => d.arcAlt)
      .arcStroke(0.4)
      .arcDashLength(0.9)
      .arcDashInitialGap((d: any) => d.order)
      .arcDashGap(15)
      .arcDashAnimateTime(2000);

    globeRef.current
      .pointsData(points)
      .pointColor(() => cfg.pointColor)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(1.2);

    globeRef.current
      .ringsData([])
      .ringColor(() => cfg.pointColor)
      .ringMaxRadius(3)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(1500);
  }, [initialized, arcs]);

  return <group ref={groupRef} />;
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

export default function World({ arcs }: { arcs: GlobeArc[] }) {
  const scene = new Scene();
  scene.fog = new Fog(0x0c0a09, 400, 2000);
  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, ASPECT, 180, 1800)}
      style={{ width: "100%", height: "100%" }}
    >
      <WebGLRendererConfig />
      <ambientLight color="#4a453f" intensity={0.6} />
      <directionalLight
        color="#ffffff"
        position={new Vector3(-400, 100, 400)}
        intensity={0.8}
      />
      <directionalLight
        color="#8a827a"
        position={new Vector3(-200, 500, 200)}
        intensity={0.6}
      />
      <pointLight
        color="#ffffff"
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <GlobeMesh arcs={arcs} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={CAMERA_Z}
        maxDistance={CAMERA_Z}
        autoRotateSpeed={0.8}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}
