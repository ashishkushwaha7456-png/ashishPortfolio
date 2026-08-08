"use client";

import * as React from "react";
import * as THREE from "three";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks";

/**
 * The hero's 3D element: a slowly rotating icosahedron wireframe wrapped in a
 * point cloud, drifting toward the cursor.
 *
 * Written against raw three.js rather than react-three-fiber on purpose — it's
 * one static scene, so a reconciler would add a dependency and a re-render
 * surface for nothing. Everything is disposed on unmount, and the loop pauses
 * when the tab is hidden or the element scrolls away.
 */
export function HeroScene({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const hasPointer = useHasPointer();

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;

    let disposed = false;
    let frame = 0;
    let running = true;

    const width = container.clientWidth;
    const height = container.clientHeight;

    /* ── Renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    // Cap DPR — a 3× retina buffer here costs more than it shows.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* ── Scene ────────────────────────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const group = new THREE.Group();
    scene.add(group);

    /* Wireframe core */
    const coreGeometry = new THREE.IcosahedronGeometry(2, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b7cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    /* Inner glass shell */
    const shellGeometry = new THREE.IcosahedronGeometry(1.42, 2);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    group.add(shell);

    /* Particle halo */
    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i += 1) {
      // Fibonacci sphere → even distribution without clumping at the poles.
      const t = i / COUNT;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.8 + Math.random() * 1.5;
      positions[i * 3] = radius * Math.sin(inclination) * Math.cos(azimuth);
      positions[i * 3 + 1] = radius * Math.sin(inclination) * Math.sin(azimuth);
      positions[i * 3 + 2] = radius * Math.cos(inclination);
      scales[i] = Math.random();
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.028,
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    /* ── Interaction ──────────────────────────────────────── */
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    if (hasPointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ── Loop ─────────────────────────────────────────────── */
    const clock = new THREE.Clock();

    const render = () => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (!running) return;

      const elapsed = clock.getElapsedTime();

      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      group.rotation.y = elapsed * 0.11 + pointer.x * 0.35;
      group.rotation.x = Math.sin(elapsed * 0.18) * 0.12 + pointer.y * 0.22;

      shell.rotation.y = -elapsed * 0.22;
      shell.rotation.z = elapsed * 0.09;
      particles.rotation.y = -elapsed * 0.045;

      // Gentle breathing so it never looks frozen.
      const breathe = 1 + Math.sin(elapsed * 0.7) * 0.02;
      core.scale.setScalar(breathe);

      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);

    /* Pause when off-screen or in a background tab. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(container);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* ── Resize ───────────────────────────────────────────── */
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    /* ── Teardown ─────────────────────────────────────────── */
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);

      coreGeometry.dispose();
      coreMaterial.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced, hasPointer]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      // The canvas is decorative; screen readers get the text content instead.
    />
  );
}

export default HeroScene;
