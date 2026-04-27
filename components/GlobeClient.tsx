"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut } from "lucide-react";

/* ─── Tunables ────────────────────────────────────────────── */
const N_POINTS  = 2200;    // dots on the sphere
const RADIUS    = 1.2;     // sphere radius in world units
const CAM_Z     = 3.6;     // starting camera distance
const MIN_ZOOM  = 2.0;     // closest allowed camera distance
const MAX_ZOOM  = 7.0;     // furthest allowed camera distance
const AUTO_VEL  = 0.0028;  // auto-rotate speed  (rad / frame at 60 fps)

/* ─── Helpers ─────────────────────────────────────────────── */

/**
 * 64×64 radial-gradient canvas texture.
 * alphaTest on the material clips the outer fade, leaving crisp circular dots
 * while the soft corona still catches AdditiveBlending for the halo layer.
 */
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

/**
 * Fibonacci / sunflower spiral — the mathematically optimal algorithm for
 * uniform point distribution on a sphere surface (no poles clustering).
 */
function fibonacciSphere(n: number, r: number): Float32Array {
  const buf     = new Float32Array(n * 3);
  const golden  = Math.PI * (3 - Math.sqrt(5)); // golden angle ≈ 2.3999 rad
  for (let i = 0; i < n; i++) {
    const y   = 1 - (i / (n - 1)) * 2;          // uniform Y from +1 → -1
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
  const camRef   = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Renderer ─────────────────────────────────────────── */
    const W = el.clientWidth  || 400;
    const H = el.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0); // fully transparent clear
    el.appendChild(renderer.domElement);

    /* ── Scene ────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.01, 100);
    camera.position.z = CAM_Z;
    camRef.current = camera;

    /* ── Geometry ─────────────────────────────────────────── */
    const positions = fibonacciSphere(N_POINTS, RADIUS);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const sprite = makeSprite();

    // Primary layer — crisp magenta dots
    const matDot = new THREE.PointsMaterial({
      color:           new THREE.Color("#C0287A"),
      size:            0.030,
      sizeAttenuation: true,
      map:             sprite,
      alphaTest:       0.22,   // clips the outer corona → tight circular shape
      transparent:     true,
      opacity:         0.82,
      depthWrite:      false,
    });

    // Halo layer — larger, peach-tinted, purely additive
    // Sits behind the dots optically; overlapping halos stack into a glow
    const matHalo = new THREE.PointsMaterial({
      color:           new THREE.Color("#F08060"),
      size:            0.060,
      sizeAttenuation: true,
      map:             sprite,
      transparent:     true,
      opacity:         0.13,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
    });

    const dotMesh  = new THREE.Points(geo, matDot);
    const haloMesh = new THREE.Points(geo, matHalo);

    // Both meshes share a Group so rotation + pulse apply together
    const group = new THREE.Group();
    group.add(haloMesh); // halo first (rendered behind)
    group.add(dotMesh);
    scene.add(group);

    /* ── Pointer physics ──────────────────────────────────── */
    let isDragging = false;
    let lastX = 0,  lastY = 0;
    let velY  = AUTO_VEL; // pre-seed so sphere rotates on first frame
    let velX  = 0;
    let rotY  = 0;
    let rotX  = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      // Don't zero velY — let inertia from auto-rotate carry through
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      // Replace velocity with live drag delta — responsive but not abrupt
      velY = (e.clientX - lastX) * 0.007;
      velX = (e.clientY - lastY) * 0.004;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, camera.position.z * (1 + e.deltaY * 0.001)),
      );
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup",   onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);
    el.addEventListener("wheel",       onWheel, { passive: false });

    /* ── Animation loop ───────────────────────────────────── */
    const clock = new THREE.Clock();
    let animId  = 0;
    let alive   = true;

    const tick = () => {
      if (!alive) return;
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Rotation physics: when the user lets go, velocity gently drifts
      // back to AUTO_VEL on Y and back to 0 on X (spring-like pull).
      if (!isDragging) {
        velY += (AUTO_VEL - velY) * 0.030; // ≈ 3 % closer per frame
        velX += (0         - velX) * 0.050;
      }
      rotY += velY;
      rotX  = Math.max(-0.52, Math.min(0.52, rotX + velX)); // soft clamp ~30°

      group.rotation.y = rotY;
      group.rotation.x = rotX;

      // Pulse: symmetric breathe at ~0.55 rad/s → ~8.7 s cycle, ±1.8 % scale
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
      el.removeEventListener("pointerdown",  onPointerDown);
      el.removeEventListener("pointermove",  onPointerMove);
      el.removeEventListener("pointerup",    onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
      el.removeEventListener("wheel",        onWheel);
      geo.dispose();
      matDot.dispose();
      matHalo.dispose();
      sprite.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  /* ── Zoom buttons (imperative camera move) ──────────────── */
  const zoom = (dir: "in" | "out") => {
    const cam = camRef.current;
    if (!cam) return;
    cam.position.z = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, cam.position.z * (dir === "in" ? 0.83 : 1.20)),
    );
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
    >
      {/* Faint radial glow — CSS only, zero GPU cost */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(184,40,122,0.07) 0%, rgba(240,128,96,0.04) 36%, transparent 62%)",
        }}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-5 right-5 z-10 flex flex-col gap-2">
        <button
          onClick={() => zoom("in")}
          aria-label="Zoom in"
          className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-plum/10 shadow-sm flex items-center justify-center text-plum/50 hover:text-plum hover:bg-white hover:border-plum/20 transition-all duration-200"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => zoom("out")}
          aria-label="Zoom out"
          className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-plum/10 shadow-sm flex items-center justify-center text-plum/50 hover:text-plum hover:bg-white hover:border-plum/20 transition-all duration-200"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
