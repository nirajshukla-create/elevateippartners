"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const N_POINTS = 1800;
const RADIUS   = 1.55;
const AUTO_VEL = 0.0007;

function makeSprite(): THREE.DataTexture {
  const sz   = 64;
  const data = new Uint8Array(sz * sz * 4);
  const cx   = sz / 2 - 0.5;
  const cy   = sz / 2 - 0.5;
  for (let y = 0; y < sz; y++) {
    for (let x = 0; x < sz; x++) {
      const dx   = x - cx;
      const dy   = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) / (sz / 2);
      const a    = dist < 1 ? Math.max(0, 1 - dist * dist) : 0;
      const i    = (y * sz + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(a * 255);
    }
  }
  const tex = new THREE.DataTexture(data, sz, sz, THREE.RGBAFormat);
  tex.needsUpdate = true;
  return tex;
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
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL not supported — fail silently
    }

    const W = el.clientWidth  || 400;
    const H = el.clientHeight || 400;

    const mobile = window.innerWidth < 1024;
    const tiny   = window.innerWidth < 400;
    const dpr    = Math.min(window.devicePixelRatio, tiny ? 1 : mobile ? 1.5 : 2);
    const camZ   = mobile ? 5.2 : 3.2;

    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.01, 100);
    camera.position.z = camZ;

    const positions = fibonacciSphere(N_POINTS, RADIUS);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const sprite = makeSprite();

    const matDot = new THREE.PointsMaterial({
      color: new THREE.Color("#C0287A"), size: 0.026, sizeAttenuation: true,
      map: sprite, alphaTest: 0.05, transparent: true, opacity: 0.38, depthWrite: false,
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

    let velY = AUTO_VEL;
    let rotY = 0;
    let isDragging = false;
    let dirLocked  = false;
    let lastX = 0;
    let lastY = 0;
    let alive = true;
    let animId = 0;

    const clock = new THREE.Clock();

    const onPointerDown = (e: PointerEvent) => {
      lastX = e.clientX; lastY = e.clientY;
      isDragging = false; dirLocked = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (!dirLocked && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        dirLocked  = true;
        isDragging = Math.abs(dx) > Math.abs(dy);
      }
      if (isDragging) {
        velY  = dx * 0.01;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const onPointerUp = () => { isDragging = false; dirLocked = false; };

    el.addEventListener("pointerdown",   onPointerDown);
    el.addEventListener("pointermove",   onPointerMove);
    el.addEventListener("pointerup",     onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    const tick = () => {
      if (!alive) return;
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      if (!isDragging) velY += (AUTO_VEL - velY) * 0.03;
      rotY += velY;
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
      geo.dispose(); matDot.dispose(); matHalo.dispose(); sprite.dispose();
      renderer.dispose();
      el.removeEventListener("pointerdown",   onPointerDown);
      el.removeEventListener("pointermove",   onPointerMove);
      el.removeEventListener("pointerup",     onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
