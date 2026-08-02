"use client";

import { useEffect, useRef } from "react";

/** Bitta zarracha holati. */
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: "iris" | "cyan";
}

const LINK_DIST = 130; // shu masofadan yaqin tugunlar chiziq bilan ulanadi
const MOUSE_DIST = 170; // kursor ta'sir radiusi

/**
 * Neyron-tarmoq fon canvas'i: suzuvchi tugunlar, ular orasidagi
 * sinaps chiziqlar va kursorga yaqinlashganda kuchayadigan aloqa.
 * AI-brend uchun "tirik tarmoq" metaforasi. DPR-aware, tab yashirin
 * bo'lsa pauza, reduced-motion'da butunlay chizilmaydi.
 */
export function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999 };

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rebuildNodes = () => {
      // Zichlik ekran maydoniga bog'liq: mobil ~45, desktop ~90 tugun
      const count = Math.min(90, Math.max(40, Math.round((width * height) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() > 0.3 ? "iris" : "cyan",
      }));
    };

    // Resize burst'lari (ayniqsa mobil URL-bar yig'ilishi) maydonni qayta
    // qurmasin: debounce + faqat kenglik sezilarli o'zgarsa rebuild.
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastRebuildWidth = 0;
    const onResize = () => {
      applySize();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (Math.abs(width - lastRebuildWidth) > 60) {
          lastRebuildWidth = width;
          rebuildNodes();
        }
      }, 200);
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;

        const color = n.hue === "iris" ? "139, 92, 246" : "34, 211, 238";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.55)`;
        ctx.fill();
      }

      // Sinaps chiziqlar — masofa qancha yaqin bo'lsa, shuncha yorqin.
      // Har chiziqqa alohida stroke o'rniga alpha ~0.02 li "chelak"larga
      // guruhlab, chelak boshiga bitta stroke chaqiriladi (~4000 juftlikda
      // stroke soni yuzlab emas, ~20 ta bo'ladi).
      const buckets = new Map<number, number[]>();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;

          // Kursor yaqinida aloqa "jonlanadi"
          const mx = (a.x + b.x) / 2 - mouse.x;
          const my = (a.y + b.y) / 2 - mouse.y;
          const mDist = Math.hypot(mx, my);
          const boost = mDist < MOUSE_DIST ? (1 - mDist / MOUSE_DIST) * 0.22 : 0;

          const alpha = (1 - dist / LINK_DIST) * 0.13 + boost;
          if (alpha < 0.015) continue;
          const bucket = Math.round(alpha * 50); // 0.02 qadam
          let seg = buckets.get(bucket);
          if (!seg) {
            seg = [];
            buckets.set(bucket, seg);
          }
          seg.push(a.x, a.y, b.x, b.y);
        }
      }
      ctx.lineWidth = 1;
      for (const [bucket, seg] of buckets) {
        ctx.beginPath();
        for (let k = 0; k < seg.length; k += 4) {
          ctx.moveTo(seg[k], seg[k + 1]);
          ctx.lineTo(seg[k + 2], seg[k + 3]);
        }
        ctx.strokeStyle = `rgba(139, 92, 246, ${(bucket / 50).toFixed(2)})`;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    applySize();
    lastRebuildWidth = width;
    rebuildNodes();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
