"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const N_POINTS = 1800;
const RADIUS   = 1.55;
const CAM_Z    = 3.2;
const AUTO_VEL = 0.0028;

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
  const buf    = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
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

export default function GlobeClient() {
  const mountRef    = useRef<HTMLDivElement>(null);
  const [isMobile,  setIsMobile]  = useState(false);
  const [activated, setActivated] = useState(false);

  // Keep a ref so Three.js event handlers can read the latest value
  // without being included in the effect deps array.
  const activatedRef = useRef(false);
  useEffect(() => { activatedRef.current = activated; }, [activated]);

  // Detect screen type once on mount — no resize listener needed.
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) {
      setActivated(true);
      activatedRef.current = true;
    }
  }, []);

  // Three.js setup — runs once.
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || 400;
    const H = el.clientHeight || 400;

    const tiny   = window.innerWidth < 400;
    const mobile = window.innerWidth < 768;
    const dpr    = Math.min(window.devicePixelRatio, tiny ? 1 : mobile ? 1.5 : 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.01, 100);
    camera.position.z = CAM_Z;

    const positions = fibonacciSphere(N_POINTS, RADIUS);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const sprite = makeSprite();

    const matDot = new THREE.PointsMaterial({
      color: new THREE.Color("#C0287A"), size: 0.026, sizeAttenuation: true,
      map: sprite, alphaTest: 0.22, transparent: true, opacity: 0.38, depthWrite: false,
    });
    const matHalo = new THREE.PointsMaterial({
      color: new THREE.Color("#F08060"), size: 0.058, sizeAttenuation: true,
      map: sprite, transparent: true, opacity: 0.07,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const group = new THREE.Group();
    group.add(new THREE.Points(geo, matHalo));
    group.add(new THREE.Points(geo, matDot));
    scene.add(group);

    // Rotation state — shared with event handlers via closure.
    let velY          = AUTO_VEL;
    let rotY          = 0;
    let isDragging    = false;
    let dirLocked     = false;
    let lastX         = 0;
    let lastY         = 0;
    let alive         = true;
    let animId        = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (!activatedRef.current) return;
      lastX     = e.clientX;
      lastY     = e.clientY;
      isDragging = false;
      dirLocked  = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!activatedRef.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      if (!dirLocked) {
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          dirLocked  = true;
          // Only enter drag mode for predominantly horizontal movement.
          isDragging = Math.abs(dx) > Math.abs(dy);
        }
      }

      if (isDragging) {
        velY  = dx * 0.01;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      dirLocked  = false;
    };

    el.addEventListener("pointerdown",   onPointerDown);
    el.addEventListener("pointermove",   onPointerMove);
    el.addEventListener("pointerup",     onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    const clock = new THREE.Clock();

    const tick = () => {
      if (!alive) return;
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      if (!isDragging) velY += (AUTO_VEL - velY) * 0.03;
      rotY           += velY;
      group.rotation.y = rotY;
      group.scale.setScalar(1 + Math.sin(t * 0.55) * 0.018);

      renderer.render(scene, camera);
    };
    tick();

    const obs = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    obs.observe(el);

    return () => {
      alive = false;
      cancelAnimationFrame(animId);
      obs.disconnect();
      geo.dispose();
      matDot.dispose();
      matHalo.dispose();
      sprite.dispose();
      renderer.dispose();
      el.removeEventListener("pointerdown",   onPointerDown);
      el.removeEventListener("pointermove",   onPointerMove);
      el.removeEventListener("pointerup",     onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Canvas — pointer-events off until the user activates on mobile */}
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{
          pointerEvents: activated ? "auto" : "none",
          // pan-y lets the browser scroll vertically; we handle horizontal drag.
          touchAction: activated && isMobile ? "pan-y" : "auto",
        }}
      />

      {/* "Tap to rotate" hint — mobile only, disappears on activation */}
      {isMobile && !activated && (
        <button
          onClick={() => setActivated(true)}
          aria-label="Tap to interact with globe"
          className="absolute inset-0 flex items-end justify-center pb-20 cursor-default"
          style={{ background: "transparent", border: "none" }}
        >
          <span className="text-[11px] font-semibold tracking-widest uppercase text-plum/35 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full select-none">
            Tap to rotate
          </span>
        </button>
      )}
    </div>
  );
}
