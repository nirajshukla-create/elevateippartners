"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

/* ─── Tunables ────────────────────────────────────────────── */
const N_POINTS  = 1800;    // dots on the sphere
const RADIUS    = 1.55;    // sphere radius in world units
const CAM_Z     = 3.2;     // camera distance
const AUTO_VEL  = 0.0028;  // auto-rotate speed (rad / frame at 60 fps)

/* ─── Helpers ─────────────────────────────────────────────── */
function makeSprite(): THREE.CanvasTexture {
  const sz  = 64;
  const c   = document.createElement("canvas");
  c.width   = c.height = sz;
  const ctx = c.getContext("2d")!;
  const g   = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
  g.addColorStop(0.00, "rgba(255,255,255,1.00)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(0.70, "rgba(255,255,255,0.12)");
  g.addColorStop(1.00, "rgba(255,255,255,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, sz, sz);
  return new THREE.CanvasTexture(c);
}

function fibonacciSphere(n: number, r: number): Float32Array {
  const buf     = new Float32Array(n * 3);
  const golden  = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y   = 1 - (i / (n - 1)) * 2;
    const rho = Math.sqrt(1 - y * y);
    const phi = golden * i;
    buf[i * 3]     = r * rho * Math.cos(phi);
    buf[i * 3 + 1] = r * y;
    buf[i * 3 + 2] = r * rho * Math.sin(phi);
  }
  return buf;
}

/* ─── Component ───────────────────────────────────────────── */
export default function GlobeClient() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Renderer ─────────────────────────────────────────── */
    const W = el.clientWidth  || 400;
    const H = el.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* ── Scene ────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.01, 100);
    camera.position.z = CAM_Z;

    /* ── Geometry ─────────────────────────────────────────── */
    const positions = fibonacciSphere(N_POINTS, RADIUS);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const sprite = makeSprite();

    // Primary dots — faint magenta
    const matDot = new THREE.PointsMaterial({
      color:           new THREE.Color("#C0287A"),
      size:            0.026,
      sizeAttenuation: true,
      map:             sprite,
      alphaTest:       0.22,
      transparent:     true,
      opacity:         0.38,
      depthWrite:      false,
    });

    // Halo layer — very subtle additive glow
    const matHalo = new THREE.PointsMaterial({
      color:           new THREE.Color("#F08060"),
      size:            0.058,
      sizeAttenuation: true,
      map:             sprite,
      transparent:     true,
      opacity:         0.07,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
    });

    const dotMesh  = new THREE.Points(geo, matDot);
    const haloMesh = new THREE.Points(geo, matHalo);

    const group = new THREE.Group();
    group.add(haloMesh);
    group.add(dotMesh);
    scene.add(group);

    /* ── Rotation state ───────────────────────────────────── */
    let velY = AUTO_VEL;
    let rotY = 0;

    /* ── Animation loop ───────────────────────────────────── */
    const clock = new THREE.Clock();
    let animId  = 0;
    let alive   = true;

    const tick = () => {
      if (!alive) return;
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      velY += (AUTO_VEL - velY) * 0.030;
      rotY += velY;
      group.rotation.y = rotY;

      const pulse = 1 + Math.sin(t * 0.55) * 0.018;
      group.scale.setScalar(pulse);

      renderer.render(scene, camera);
    };
    tick();

    /* ── Responsive resize ────────────────────────────────── */
    const obs = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    obs.observe(el);

    /* ── Cleanup ──────────────────────────────────────────── */
    return () => {
      alive = false;
      cancelAnimationFrame(animId);
      obs.disconnect();
      geo.dispose();
      matDot.dispose();
      matHalo.dispose();
      sprite.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
    />
  );
}
