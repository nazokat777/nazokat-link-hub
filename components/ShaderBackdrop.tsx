"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL fragment-shader fon — iridescent domain-warped oqim (iris/cyan/magenta).
 * Kursorga yumshoq reaksiya beradi, past rezolyutsiyada render bo'lib CSS bilan
 * kattalashtiriladi (silliq, arzon), tab yashirinsa pauza qiladi.
 * reduced-motion'da bitta statik kadr chiziladi (harakat yo'q).
 * WebGL yo'q bo'lsa — jimgina chiqmaydi, CSS aurora zaxira bo'lib qoladi.
 */
export function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "low-power" }) as
        | WebGLRenderingContext
        | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // fallback: CSS aurora qoladi

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vert = `
      attribute vec2 p;
      void main(){ gl_Position = vec4(p, 0.0, 1.0); }
    `;

    const frag = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uMouse;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 p = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
        float t = uTime * 0.05;

        // Domain warping — tutunsimon oqim
        vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
        vec2 r = vec2(
          fbm(p + 3.5 * q + vec2(1.7, 9.2) + 0.15 * t),
          fbm(p + 3.5 * q + vec2(8.3, 2.8) - 0.12 * t)
        );
        float f = fbm(p + 3.5 * r);

        // Kursor nuri — mayin, faqat ozgina jonlantiradi
        float m = smoothstep(0.85, 0.0, length(p - uMouse));
        f += m * 0.10;

        // Nafis palitra: lavanda -> atirgul-pushti -> shampan oltin
        vec3 lavender = vec3(0.745, 0.584, 1.000);
        vec3 rose     = vec3(1.000, 0.494, 0.714);
        vec3 gold     = vec3(0.965, 0.757, 0.467);

        vec3 col = mix(lavender, rose, clamp(f * 1.5, 0.0, 1.0));
        col = mix(col, gold, clamp(r.x * 0.55, 0.0, 1.0));

        // Chuqur plum-qora fonga kuchli singdiramiz — bu bezak, matn ustuvor
        vec3 bg = vec3(0.027, 0.016, 0.035);
        col = mix(bg, col, 0.10 + 0.20 * f + m * 0.08);
        col *= 0.7;

        // Vignette — chekkalar qorayadi, markaz biroz yorug'
        float vig = smoothstep(1.7, 0.1, length(p));
        col *= 0.5 + 0.5 * vig;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // To'liq ekran uchburchagi
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    let w = 0;
    let h = 0;
    const resize = () => {
      // Past rezolyutsiya: tutunsimon fon uchun ko'zga bilinmaydi, GPU'ni tejaydi
      const scale = Math.min(0.6, 1400 / Math.max(window.innerWidth, 1));
      w = Math.max(1, Math.round(window.innerWidth * scale));
      h = Math.max(1, Math.round(window.innerHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();

    // Kursor (shader koordinatasiga o'tkazilgan), yumshoq lerp bilan
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX * 2 - window.innerWidth) / window.innerHeight;
      target.y = -(e.clientY * 2 - window.innerHeight) / window.innerHeight;
    };

    let raf = 0;
    let running = true;
    const t0 = 0;
    let last = 0;

    const render = (nowMs: number) => {
      if (!running) return;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, (nowMs - last) / 1000 + t0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    if (reduced) {
      // Statik bitta kadr — harakatsiz, lekin baribir chiroyli gradient
      gl.uniform2f(uMouse, 0, 0);
      gl.uniform1f(uTime, 12.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      window.addEventListener("mousemove", onMove);
      const onVis = () => {
        running = !document.hidden;
        if (running) {
          last = performance.now() - 1000; // vaqtni uzluksiz saqlaymiz
          raf = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(raf);
        }
      };
      document.addEventListener("visibilitychange", onVis);
      last = performance.now();
      raf = requestAnimationFrame(render);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-80"
    />
  );
}
